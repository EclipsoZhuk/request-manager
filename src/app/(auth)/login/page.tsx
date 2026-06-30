import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/features/auth/login-form'
import { ROLE_HOME_PATH, getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
	title: 'Логин'
}

export default async function LoginPage() {
	const user = await getCurrentUser()

	if (user) {
		redirect(ROLE_HOME_PATH[user.role])
	}

	return (
		<main className='relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10'>
			<div
				className='absolute inset-0 bg-cover bg-center bg-no-repeat'
				style={{
					backgroundImage: "url('/images/auth/login-background.webp')"
				}}
			/>

			<section className='bg-card relative w-full max-w-157.5 space-y-10 rounded-[24px] border border-[#B9B9B9] px-15 py-20'>
				<div className='flex flex-col items-center space-y-10'>
					<Image
						src='/images/logo.svg'
						alt='Logo'
						width={44}
						height={44}
						unoptimized
						priority
						className='size-11'
					/>

					<h1 className='text-[32px] font-bold tracking-[-0.11px]'>Логин</h1>
				</div>

				<LoginForm />
			</section>
		</main>
	)
}
