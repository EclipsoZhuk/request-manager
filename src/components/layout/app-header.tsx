'use client'

import { Zap } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { getRouteTitle } from '@/config/routes'

import { LogoutButton } from './logout-button'

export function AppHeader() {
	const pathname = usePathname()
	const title = getRouteTitle(pathname)

	return (
		<header className='bg-card flex h-18 shrink-0 items-center justify-between border-b px-6 lg:px-10'>
			<div className='flex min-w-0 items-center gap-3'>
				<Zap className='fill-primary text-primary size-8 shrink-0' />
				<h1 className='truncate text-2xl font-semibold'>{title}</h1>
			</div>
			<LogoutButton />
		</header>
	)
}
