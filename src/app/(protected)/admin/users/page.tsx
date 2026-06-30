import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Пользователи'
}

export default function AdminUsersPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Пользователи</h2>
		</section>
	)
}
