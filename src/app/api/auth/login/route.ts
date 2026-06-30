import { NextResponse } from 'next/server'

import type { AuthUser } from '@/types/auth.types'

import { loginSchema } from '@/features/auth/schemas/login.schema'
import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import {
	SESSION_COOKIE_NAME,
	createSessionToken,
	sessionCookieOptions
} from '@/lib/auth/session'

type MockUser = AuthUser & {
	password: string
}

const MOCK_USERS: MockUser[] = [
	{
		id: 'manager-1',
		login: 'manager',
		password: 'manager123',
		role: 'manager',
		domainId: 'domain-1'
	},
	{
		id: 'admin-1',
		login: 'admin',
		password: 'admin123',
		role: 'admin',
		domainId: 'domain-1'
	}
]

export async function POST(request: Request) {
	try {
		const body: unknown = await request.json()

		const result = loginSchema.safeParse(body)

		if (!result.success) {
			return NextResponse.json(
				{
					message: 'Проверьте правильность заполнения полей'
				},
				{
					status: 422
				}
			)
		}

		const { login, password, domain } = result.data

		const mockUser = MOCK_USERS.find(
			user =>
				user.login === login &&
				user.password === password &&
				user.domainId === domain
		)

		if (!mockUser) {
			return NextResponse.json(
				{
					message: 'Неверный логин, пароль или домен'
				},
				{
					status: 401
				}
			)
		}

		const user: AuthUser = {
			id: mockUser.id,
			login: mockUser.login,
			role: mockUser.role,
			domainId: mockUser.domainId
		}

		const token = createSessionToken(user)

		const response = NextResponse.json({
			user,
			redirectTo: ROLE_HOME_PATH[user.role]
		})

		response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)

		return response
	} catch {
		return NextResponse.json(
			{
				message: 'Не удалось выполнить вход'
			},
			{
				status: 500
			}
		)
	}
}
