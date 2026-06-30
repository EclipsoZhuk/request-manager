import { redirect } from 'next/navigation'

import { LoginForm } from '@/features/auth/login-form'
import { ROLE_HOME_PATH, getCurrentUser } from '@/lib/auth'

export default async function LoginPage() {
	const user = await getCurrentUser()

	if (user) {
		redirect(ROLE_HOME_PATH[user.role])
	}

	return (
		<main className='bg-muted flex min-h-dvh items-center justify-center p-5'>
			<div className='bg-card w-full max-w-135 rounded-2xl border p-10'>
				<h1 className='mb-8 text-center text-3xl font-semibold'>Логин</h1>

				<LoginForm />
			</div>
		</main>
	)
}
