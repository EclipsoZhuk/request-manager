import type { Metadata } from 'next'

import { getMockStatistics } from '@/features/statistics/mock'
import { StatisticsPageContent } from '@/features/statistics/statistics-page-content'

export const metadata: Metadata = {
	title: 'Статистика'
}

export default function AdminStatisticsPage() {
	const statistics = getMockStatistics()

	return (
		<div className='h-full min-h-0'>
			<StatisticsPageContent
				variant='admin'
				regions={statistics.regions}
				paymentGoals={statistics.paymentGoals}
			/>
		</div>
	)
}
