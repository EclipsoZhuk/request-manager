import { AppShell } from '@/components/layout/app-shell'

import { requireRole } from '@/lib/auth/require-role'

type ManagerLayoutProps = {
	children: React.ReactNode
}

export default async function ManagerLayout({ children }: ManagerLayoutProps) {
	await requireRole('manager')

	return <AppShell role='manager'>{children}</AppShell>
}
