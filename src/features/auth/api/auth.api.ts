import axios from 'axios'

import type { AuthUser } from '@/types/auth.types'

import type { LoginFormValues } from '../schemas/login.schema'

export type LoginResponse = {
	user: AuthUser
	redirectTo: string
}

export async function login(values: LoginFormValues) {
	const response = await axios.post<LoginResponse>('/api/auth/login', values)
	return response.data
}

export async function logout() {
	await axios.post('/api/auth/logout')
}

export function getAuthErrorMessage(error: unknown) {
	if (axios.isAxiosError<{ message?: string }>(error)) {
		return error.response?.data?.message ?? 'Не удалось выполнить запрос'
	}

	return 'Произошла неизвестная ошибка'
}
