'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navigationByRole } from '@/config/navigation'

import type { UserRole } from '@/features/auth/schema'
import { cn } from '@/lib/utils'

type AppSidebarProps = {
	role: UserRole
}

export function AppSidebar({ role }: AppSidebarProps) {
	const pathname = usePathname()
	const navigation = navigationByRole[role]

	return (
		<aside className='bg-sidebar hidden w-50 shrink-0 border-r lg:block'>
			<nav className='flex flex-col gap-2 p-5'>
				{navigation.map(item => {
					const isActive = pathname === item.href

					return (
						<Link
							key={item.href}
							href={item.href}
							aria-current={isActive ? 'page' : undefined}
							className={cn(
								'relative flex min-h-11 items-center rounded-md px-4 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground'
									: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
							)}
						>
							{isActive && (
								<span className='bg-primary absolute top-0 -left-5 h-full w-1 rounded-r-full' />
							)}

							{item.label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
