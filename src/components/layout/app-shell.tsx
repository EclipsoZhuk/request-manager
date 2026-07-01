import type { UserRole } from '@/types/auth.types'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AppShellProps = {
	role: UserRole
	children: React.ReactNode
}

export function AppShell({ role, children }: AppShellProps) {
	return (
		<div className='bg-background flex h-dvh flex-col overflow-hidden'>
			<AppHeader />

			<div className='flex min-h-0 flex-1 overflow-hidden'>
				<AppSidebar role={role} />

				<main className='min-h-0 min-w-0 flex-1 overflow-y-auto p-5'>
					{children}
				</main>
			</div>
		</div>
	)
}
