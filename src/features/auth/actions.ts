'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import type { LoginActionState } from './login-state'
import { MockAuthError } from './mock'
import { loginSchema } from './schema'
import { login as loginWithBackend, logout } from './service'
import { ROLE_HOME_PATH } from '@/lib/auth'
import { BackendError } from '@/lib/backend'
import {
	deleteAccessToken,
	getAccessToken,
	setAccessToken
} from '@/lib/session'

export async function loginAction(
	_previousState: LoginActionState,
	formData: FormData
): Promise<LoginActionState> {
	const rawValues = {
		login: String(formData.get('login') ?? ''),
		password: String(formData.get('password') ?? ''),
		domain: String(formData.get('domain') ?? '')
	}

	const parsed = loginSchema.safeParse(rawValues)

	if (!parsed.success) {
		const { fieldErrors } = z.flattenError(parsed.error)

		return {
			message: null,
			fieldErrors,
			values: {
				login: rawValues.login,
				domain: rawValues.domain
			}
		}
	}

	let authResult

	try {
		authResult = await loginWithBackend(parsed.data)
	} catch (error) {
		if (error instanceof MockAuthError || error instanceof BackendError) {
			return {
				message: error.message,
				fieldErrors: {},
				values: {
					login: parsed.data.login,
					domain: parsed.data.domain
				}
			}
		}

		console.error('Login action error:', error)

		return {
			message: 'Не удалось выполнить вход. Попробуйте ещё раз.',
			fieldErrors: {},
			values: {
				login: parsed.data.login,
				domain: parsed.data.domain
			}
		}
	}

	await setAccessToken(authResult.accessToken, authResult.expiresIn)

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
