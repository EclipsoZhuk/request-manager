import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Цели оплаты'
}

export default function AdminPaymentGoalsPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Цели оплаты</h2>
		</section>
	)
}
