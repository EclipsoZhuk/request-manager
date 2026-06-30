import { redirect } from 'next/navigation'

import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import { getSession } from '@/lib/auth/session'

export default async function NotFound() {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	redirect(ROLE_HOME_PATH[session.user.role])
}
