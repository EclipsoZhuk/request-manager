import type { Metadata } from 'next'

import { LimitsPageContent } from '@/features/admin/limits-page-content'
import { adminLimits } from '@/features/admin/mock'

export const metadata: Metadata = {
	title: 'Лимиты'
}

export default function AdminLimitsPage() {
	return (
		<div className='h-full min-h-0'>
			<LimitsPageContent limits={adminLimits} />
		</div>
	)
}
