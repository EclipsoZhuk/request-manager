import 'server-only'

import type { AuthUser, BackendLoginResponse, LoginInput } from './schema'

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

const MOCK_TOKENS: Record<string, AuthUser> = {
	'mock-manager-token': {
		id: 'manager-1',
		login: 'manager',
		role: 'manager',
		domainId: 'domain-1'
	},
	'mock-admin-token': {
		id: 'admin-1',
		login: 'admin',
		role: 'admin',
		domainId: 'domain-1'
	}
}

export class MockAuthError extends Error {
	constructor(message: string) {
		super(message)

		this.name = 'MockAuthError'
	}
}

export async function mockLogin(
	input: LoginInput
): Promise<BackendLoginResponse> {
	const user = MOCK_USERS.find(
		item =>
			item.login === input.login &&
			item.password === input.password &&
			item.domainId === input.domain
	)

	if (!user) {
		throw new MockAuthError('Неверный логин, пароль или домен')
	}

	const authUser: AuthUser = {
		id: user.id,
		login: user.login,
		role: user.role,
		domainId: user.domainId
	}

	const accessToken =
		user.role === 'manager' ? 'mock-manager-token' : 'mock-admin-token'

	return {
		accessToken,
		expiresIn: 8 * 60 * 60,
		user: authUser
	}
}

export async function mockGetCurrentUser(
	accessToken: string
): Promise<AuthUser | null> {
	return MOCK_TOKENS[accessToken] ?? null
}

export async function mockLogout() {
	return
}
