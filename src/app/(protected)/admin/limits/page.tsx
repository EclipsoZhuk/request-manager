import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Лимиты'
}

export default function AdminLimitsPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Лимиты</h2>
		</section>
	)
}
