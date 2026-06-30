'use server'

import { redirect } from 'next/navigation'

import type { LoginActionResult } from './action.types'
import { MockAuthError } from './mock'
import { type LoginInput, loginSchema } from './schema'
import { login as loginWithBackend, logout } from './service'
import { ROLE_HOME_PATH } from '@/lib/auth'
import { BackendError } from '@/lib/backend'
import {
	deleteAccessToken,
	getAccessToken,
	setAccessToken
} from '@/lib/session'

export async function loginAction(
	input: LoginInput
): Promise<LoginActionResult> {
	/*
	 * Никогда не доверяем только клиентской валидации.
	 * Повторно проверяем данные внутри Server Action.
	 */
	const parsed = loginSchema.safeParse(input)

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors
		}
	}

	let authResult

	try {
		authResult = await loginWithBackend(parsed.data)
	} catch (error) {
		if (error instanceof MockAuthError || error instanceof BackendError) {
			return {
				success: false,
				message: error.message
			}
		}

		console.error('Login action error:', error)

		return {
			success: false,
			message: 'Не удалось выполнить вход. Попробуйте ещё раз.'
		}
	}

	await setAccessToken(authResult.accessToken, authResult.expiresIn)

	/*
	 * redirect должен находиться вне try/catch,
	 * потому что внутри Next.js он прерывает выполнение.
	 */
	redirect(ROLE_HOME_PATH[authResult.user.role])
}

export async function logoutAction() {
	const accessToken = await getAccessToken()

	if (accessToken) {
		await logout(accessToken)
	}

	await deleteAccessToken()

	redirect('/login')
}
