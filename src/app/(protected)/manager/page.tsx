import { requireRole } from '@/lib/auth'

export default async function ManagerPage() {
	const user = await requireRole('manager')

	return (
		<section className='bg-card rounded-2xl border p-8'>
			<h2 className='text-2xl font-semibold'>Панель менеджера</h2>

			<p className='text-muted-foreground mt-3'>
				Добро пожаловать, {user.login}.
			</p>
		</section>
	)
}
