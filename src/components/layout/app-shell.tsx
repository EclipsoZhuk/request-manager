import type { UserRole } from '@/types/auth.types'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AppShellProps = {
	role: UserRole
	children: React.ReactNode
}

export function AppShell({ role, children }: AppShellProps) {
	return (
		<div className='bg-background flex min-h-dvh flex-col'>
			<AppHeader />

			<div className='flex flex-1'>
				<AppSidebar role={role} />

				<main className='min-w-0 flex-1 p-5 lg:p-8'>{children}</main>
			</div>
		</div>
	)
}
