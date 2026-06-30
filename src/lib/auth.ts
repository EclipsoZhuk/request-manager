import { redirect } from 'next/navigation'
import { cache } from 'react'
import 'server-only'

import { getAccessToken } from './session'
import type { AuthUser, UserRole } from '@/features/auth/schema'
import { getCurrentUser as requestCurrentUser } from '@/features/auth/service'

export const ROLE_HOME_PATH: Record<UserRole, string> = {
	manager: '/manager',
	admin: '/admin'
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
	const accessToken = await getAccessToken()

	if (!accessToken) {
		return null
	}

	return requestCurrentUser(accessToken)
})

export async function requireUser() {
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	return user
}

export async function requireRole(requiredRole: UserRole) {
	const user = await requireUser()

	if (user.role !== requiredRole) {
		redirect(ROLE_HOME_PATH[user.role])
	}

	return user
}
