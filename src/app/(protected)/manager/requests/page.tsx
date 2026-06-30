import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Все заявки'
}

export default function ManagerRequestsPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Все заявки</h2>
		</section>
	)
}
