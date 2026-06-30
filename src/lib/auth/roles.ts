import type { UserRole } from '@/types/auth.types'

export const ROLE_HOME_PATH: Record<UserRole, string> = {
	manager: '/manager/requests/create',
	admin: '/admin/users'
}

export function isUserRole(value: unknown): value is UserRole {
	return value === 'manager' || value === 'admin'
}
