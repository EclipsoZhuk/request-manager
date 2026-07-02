import type { Metadata } from 'next'

import { LimitsPageContent } from '@/features/admin/limits-page-content'
import { adminLimits } from '@/features/admin/mock'

export const metadata: Metadata = {
	title: 'Лимиты'
}

export default function AdminLimitsPage() {
	return <LimitsPageContent limits={adminLimits} />
}
