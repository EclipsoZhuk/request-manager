import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Статистика'
}

export default function ManagerStatisticsPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Статистика</h2>
		</section>
	)
}
