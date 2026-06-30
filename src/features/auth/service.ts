import 'server-only'

import { mockGetCurrentUser, mockLogin, mockLogout } from './mock'
import {
	type AuthUser,
	type BackendLoginResponse,
	type LoginInput,
	authUserSchema,
	backendLoginResponseSchema
} from './schema'
import { BackendError, backendRequest } from '@/lib/backend'

function isMockBackendEnabled() {
	return process.env.USE_MOCK_BACKEND === 'true'
}

export async function login(input: LoginInput): Promise<BackendLoginResponse> {
	if (isMockBackendEnabled()) {
		return mockLogin(input)
	}

	const response = await backendRequest<unknown>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(input)
	})

	const result = backendLoginResponseSchema.safeParse(response)

	if (!result.success) {
		throw new BackendError('Backend вернул некорректный ответ авторизации', 502)
	}

	return result.data
}

export async function getCurrentUser(
	accessToken: string
): Promise<AuthUser | null> {
	if (isMockBackendEnabled()) {
		return mockGetCurrentUser(accessToken)
	}

	try {
		const response = await backendRequest<unknown>('/auth/me', {
			accessToken
		})

		const result = authUserSchema.safeParse(response)

		if (!result.success) {
			return null
		}

		return result.data
	} catch (error) {
		if (
			error instanceof BackendError &&
			(error.status === 401 || error.status === 403)
		) {
			return null
		}

		throw error
	}
}

export async function logout(accessToken: string) {
	if (isMockBackendEnabled()) {
		await mockLogout()
		return
	}

	try {
		await backendRequest<void>('/auth/logout', {
			method: 'POST',
			accessToken
		})
	} catch {
		/*
		 * Даже если backend недоступен,
		 * локальная cookie всё равно будет удалена.
		 */
	}
}
