import { Zap } from 'lucide-react'
import type { Metadata } from 'next'
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

			<div className='absolute inset-0 bg-white/10' />

			<section className='relative z-10 w-full max-w-[630px] rounded-[24px] border border-black/25 bg-white px-13 py-15 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'>
				<div className='mb-12 flex flex-col items-center'>
					<Zap
						aria-hidden='true'
						className='fill-primary text-primary mb-7 size-11'
						strokeWidth={1.8}
					/>

					<h1 className='text-foreground text-[32px] leading-none font-semibold tracking-[-0.02em]'>
						Логин
					</h1>
				</div>

				<LoginForm />
			</section>
		</main>
	)
}
