'use client'

import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible'

import { type NavigationLink, navigationByRole } from '@/config/navigation'

import type { UserRole } from '@/features/auth/schema'
import { cn } from '@/lib/utils'

type AppSidebarProps = {
	role: UserRole
}

type SidebarLinkProps = {
	item: NavigationLink
	pathname: string
	isChild?: boolean
}

function isLinkActive(pathname: string, href: string) {
	return pathname === href
}

function SidebarLink({ item, pathname, isChild = false }: SidebarLinkProps) {
	const isActive = isLinkActive(pathname, item.href)

	if (isChild) {
		return (
			<Link
				href={item.href}
				aria-current={isActive ? 'page' : undefined}
				className={cn(
					'flex min-h-12.5 items-center px-4 py-2 pl-10 transition-colors',
					isActive
						? 'text-primary font-semibold'
						: 'text-sidebar-foreground hover:text-primary'
				)}
			>
				{item.label}
			</Link>
		)
	}

	return (
		<Link
			href={item.href}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'relative flex min-h-12.5 items-center rounded-md px-4 py-2 transition-colors',
				isActive
					? 'bg-primary text-primary-foreground'
					: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
			)}
		>
			{isActive && (
				<span className='bg-primary absolute top-0 -left-5 h-full w-1.5 rounded-r-full' />
			)}

			{item.label}
		</Link>
	)
}

export function AppSidebar({ role }: AppSidebarProps) {
	const pathname = usePathname()
	const navigation = navigationByRole[role]

	return (
		<aside className='bg-sidebar hidden w-59 shrink-0 border-r lg:block'>
			<nav className='flex flex-col gap-1.5 p-5 font-semibold'>
				{navigation.map(item => {
					if (item.type === 'link') {
						return (
							<SidebarLink
								key={item.href}
								item={item}
								pathname={pathname}
							/>
						)
					}

					const hasActiveChild = item.children.some(child =>
						isLinkActive(pathname, child.href)
					)

					return (
						<Collapsible
							key={item.label}
							defaultOpen={hasActiveChild}
							className='mt-1'
						>
							<CollapsibleTrigger
								className={cn(
									'group relative flex min-h-17.5 w-full items-center justify-between rounded-md px-4 py-2 text-left transition-colors',
									hasActiveChild
										? 'bg-primary text-primary-foreground'
										: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
								)}
							>
								{hasActiveChild && (
									<span className='bg-primary absolute top-0 -left-5 h-full w-1.5 rounded-r-full' />
								)}

								<span className='leading-5'>{item.label}</span>

								<ChevronUp className='size-5 shrink-0 transition-transform group-data-[state=closed]:rotate-180' />
							</CollapsibleTrigger>

							<CollapsibleContent>
								<div className='flex flex-col gap-1 pt-2'>
									{item.children.map(child => (
										<SidebarLink
											key={child.href}
											item={child}
											pathname={pathname}
											isChild
										/>
									))}
								</div>
							</CollapsibleContent>
						</Collapsible>
					)
				})}
			</nav>
		</aside>
	)
}
