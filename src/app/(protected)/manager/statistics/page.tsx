import type { Metadata } from 'next'

import { getMockStatistics } from '@/features/statistics/mock'
import { StatisticsPageContent } from '@/features/statistics/statistics-page-content'

export const metadata: Metadata = {
	title: 'Статистика'
}

export default function ManagerStatisticsPage() {
	const statistics = getMockStatistics()

	return (
		<div className='h-full min-h-0'>
			<StatisticsPageContent
				variant='manager'
				regions={statistics.regions}
				paymentGoals={statistics.paymentGoals}
			/>
		</div>
	)
}
