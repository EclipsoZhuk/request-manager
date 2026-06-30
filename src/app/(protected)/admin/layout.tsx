import { redirect } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'

import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import { getSession } from '@/lib/auth/session'

type AdminLayoutProps = {
	children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	if (session.user.role !== 'admin') {
		redirect(ROLE_HOME_PATH[session.user.role])
	}

	return <AppShell role='admin'>{children}</AppShell>
}
