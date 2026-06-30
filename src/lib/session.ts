import { cookies } from 'next/headers'
import 'server-only'

const ACCESS_TOKEN_COOKIE = 'request_manager_access_token'

const DEFAULT_TOKEN_LIFETIME = 8 * 60 * 60

const baseCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/'
}

export async function getAccessToken() {
	const cookieStore = await cookies()

	return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null
}

export async function setAccessToken(
	accessToken: string,
	expiresIn = DEFAULT_TOKEN_LIFETIME
) {
	const cookieStore = await cookies()

	cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
		...baseCookieOptions,
		maxAge: expiresIn
	})
}

export async function deleteAccessToken() {
	const cookieStore = await cookies()

	cookieStore.delete(ACCESS_TOKEN_COOKIE)
}
