'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { getRouteTitle } from '@/config/routes'

import { LogoutButton } from './logout-button'

export function AppHeader() {
	const pathname = usePathname()
	const title = getRouteTitle(pathname)

	return (
		<header className='bg-card flex h-18 shrink-0 items-center justify-between border-b px-11'>
			<div className='flex min-w-0 items-center gap-2.5'>
				<Image
					src='/images/logo.svg'
					alt='Logo'
					width={32}
					height={32}
					unoptimized
					priority
					className='size-8'
				/>
				<h1 className='truncate text-[32px] font-bold'>{title}</h1>
			</div>
			<LogoutButton />
		</header>
	)
}
