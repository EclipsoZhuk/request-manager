import { redirect } from 'next/navigation'

import type { UserRole } from '@/types/auth.types'

import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import { getSession } from '@/lib/auth/session'

export async function requireRole(requiredRole: UserRole) {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	if (session.user.role !== requiredRole) {
		redirect(ROLE_HOME_PATH[session.user.role])
	}

	return session
}
