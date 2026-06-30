import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Создать заявку'
}

export default function ManagerCreateRequestPage() {
	return (
		<section>
			<h2 className='text-2xl font-semibold'>Создать заявку</h2>
		</section>
	)
}
