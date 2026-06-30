import { requireRole } from '@/lib/auth'

export default async function AdminPage() {
	const user = await requireRole('admin')

	return (
		<section className='bg-card rounded-2xl border p-8'>
			<h2 className='text-2xl font-semibold'>Панель администратора</h2>

			<p className='text-muted-foreground mt-3'>
				Добро пожаловать, {user.login}.
			</p>
		</section>
	)
}
