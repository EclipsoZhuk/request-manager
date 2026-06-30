import { redirect } from 'next/navigation'

import { ROLE_HOME_PATH, getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	redirect(ROLE_HOME_PATH[user.role])
}
