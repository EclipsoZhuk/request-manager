'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { logout } from '@/features/auth/api/auth.api'

export function LogoutButton() {
	const router = useRouter()
	const [isPending, setIsPending] = useState(false)

	async function handleLogout() {
		try {
			setIsPending(true)

			await logout()

			router.replace('/login')
			router.refresh()
		} finally {
			setIsPending(false)
		}
	}

	return (
		<Button
			type='button'
			variant='secondary'
			disabled={isPending}
			onClick={handleLogout}
			className='h-8 min-w-28 rounded-xl'
		>
			{isPending ? 'Выход...' : 'Выход'}
		</Button>
	)
}
