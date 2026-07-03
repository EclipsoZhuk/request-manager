import type { Metadata } from 'next'

import { adminPaymentGoals } from '@/features/admin/mock'
import { PaymentGoalsPageContent } from '@/features/admin/payment-goals-page-content'

export const metadata: Metadata = {
	title: 'Цели оплаты'
}

export default function AdminPaymentGoalsPage() {
	return (
		<div className='h-full min-h-0'>
			<PaymentGoalsPageContent initialPaymentGoals={adminPaymentGoals} />
		</div>
	)
}
