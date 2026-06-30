export const USER_ROLES = ['manager', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type AuthUser = {
	id: string
	login: string
	role: UserRole
	domainId: string
}

export type AuthSession = {
	user: AuthUser
	expiresAt: number
}
