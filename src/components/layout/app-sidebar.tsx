'use client'

import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible'

import type { UserRole } from '@/types/auth.types'

import { type NavigationLink, navigationByRole } from '@/config/navigation'

import { cn } from '@/lib/utils'

type AppSidebarProps = {
	role: UserRole
}

function isLinkActive(pathname: string, href: string) {
	return pathname === href
}

function SidebarLink({
	item,
	pathname
}: {
	item: NavigationLink
	pathname: string
}) {
	const isActive = isLinkActive(pathname, item.href)

	return (
		<Link
			href={item.href}
			className={cn(
				'relative flex min-h-11 items-center rounded-md px-4 text-sm font-medium transition-colors',
				isActive
					? 'bg-primary text-primary-foreground'
					: 'text-foreground hover:bg-muted'
			)}
		>
			{isActive && (
				<span className='bg-primary absolute top-0 -left-5 h-full w-1 rounded-r-full' />
			)}

			{item.label}
		</Link>
	)
}

export function AppSidebar({ role }: AppSidebarProps) {
	const pathname = usePathname()
	const navigation = navigationByRole[role]

	return (
		<aside className='bg-sidebar hidden w-[202px] shrink-0 border-r lg:block'>
			<nav className='flex flex-col gap-2 p-5'>
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
									'relative flex min-h-11 w-full items-center justify-between rounded-md px-4 text-left text-sm font-medium transition-colors',
									hasActiveChild
										? 'bg-primary text-primary-foreground'
										: 'hover:bg-muted'
								)}
							>
								{hasActiveChild && (
									<span className='bg-primary absolute top-0 -left-5 h-full w-1 rounded-r-full' />
								)}

								<span className='max-w-28'>{item.label}</span>

								<ChevronUp className='size-4 transition-transform [[data-state=closed]>&]:rotate-180' />
							</CollapsibleTrigger>

							<CollapsibleContent>
								<div className='flex flex-col gap-1 pt-2'>
									{item.children.map(child => {
										const isActive = isLinkActive(pathname, child.href)

										return (
											<Link
												key={child.href}
												href={child.href}
												className={cn(
													'min-h-10 px-4 py-2 pl-8 text-sm transition-colors',
													isActive
														? 'text-primary font-medium'
														: 'text-foreground hover:text-primary'
												)}
											>
												{child.label}
											</Link>
										)
									})}
								</div>
							</CollapsibleContent>
						</Collapsible>
					)
				})}
			</nav>
		</aside>
	)
}
