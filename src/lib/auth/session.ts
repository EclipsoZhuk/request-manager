import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

import type { AuthSession, AuthUser } from '@/types/auth.types'

import { isUserRole } from '@/lib/auth/roles'

export const SESSION_COOKIE_NAME = 'request_manager_session'

const SESSION_DURATION_SECONDS = 60 * 60 * 8

function getAuthSecret() {
	const secret = process.env.AUTH_SECRET

	if (!secret) {
		throw new Error('Переменная окружения AUTH_SECRET не настроена')
	}

	return secret
}

function createSignature(payload: string) {
	return createHmac('sha256', getAuthSecret())
		.update(payload)
		.digest('base64url')
}

function isValidSession(value: unknown): value is AuthSession {
	if (!value || typeof value !== 'object') {
		return false
	}

	const session = value as Partial<AuthSession>
	const user = session.user as Partial<AuthUser> | undefined

	return (
		typeof session.expiresAt === 'number' &&
		session.expiresAt > Date.now() &&
		typeof user?.id === 'string' &&
		typeof user.login === 'string' &&
		typeof user.domainId === 'string' &&
		isUserRole(user.role)
	)
}

export function createSessionToken(user: AuthUser) {
	const session: AuthSession = {
		user,
		expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000
	}

	const payload = Buffer.from(JSON.stringify(session), 'utf8').toString(
		'base64url'
	)

	const signature = createSignature(payload)

	return `${payload}.${signature}`
}

export function verifySessionToken(token: string): AuthSession | null {
	try {
		const [payload, signature] = token.split('.')

		if (!payload || !signature) {
			return null
		}

		const expectedSignature = createSignature(payload)

		const signatureBuffer = Buffer.from(signature)
		const expectedBuffer = Buffer.from(expectedSignature)

		if (
			signatureBuffer.length !== expectedBuffer.length ||
			!timingSafeEqual(signatureBuffer, expectedBuffer)
		) {
			return null
		}

		const parsedSession: unknown = JSON.parse(
			Buffer.from(payload, 'base64url').toString('utf8')
		)

		return isValidSession(parsedSession) ? parsedSession : null
	} catch {
		return null
	}
}

export async function getSession() {
	const cookieStore = await cookies()

	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

	if (!token) {
		return null
	}

	return verifySessionToken(token)
}

export const sessionCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
	maxAge: SESSION_DURATION_SECONDS
}
