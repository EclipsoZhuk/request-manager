import { AppShell } from '@/components/layout/app-shell'

import { requireRole } from '@/lib/auth'

type AdminLayoutProps = {
	children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	await requireRole('admin')

	return <AppShell role='admin'>{children}</AppShell>
}
