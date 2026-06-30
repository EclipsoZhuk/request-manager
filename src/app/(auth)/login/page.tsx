import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/features/auth/components/login-form'
import { ROLE_HOME_PATH } from '@/lib/auth/roles'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
	title: 'Вход'
}

export default async function LoginPage() {
	const session = await getSession()

	if (session) {
		redirect(ROLE_HOME_PATH[session.user.role])
	}

	return (
		<main
			className='flex min-h-dvh items-center justify-center bg-zinc-100 bg-cover bg-center px-5 py-10'
			style={{
				backgroundImage: `
					linear-gradient(
						rgba(255, 255, 255, 0.25),
						rgba(255, 255, 255, 0.25)
					),
					url('/images/auth/login-bg.webp')
				`
			}}
		>
			<LoginForm />
		</main>
	)
}
