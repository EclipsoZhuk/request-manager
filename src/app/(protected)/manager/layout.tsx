import { redirect } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'

import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import { getSession } from '@/lib/auth/session'

type ManagerLayoutProps = {
	children: React.ReactNode
}

export default async function ManagerLayout({ children }: ManagerLayoutProps) {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	if (session.user.role !== 'manager') {
		redirect(ROLE_HOME_PATH[session.user.role])
	}

	return <AppShell role='manager'>{children}</AppShell>
}
