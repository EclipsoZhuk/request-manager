import type { Metadata } from 'next'

import { getMockRequests } from '@/features/requests/mock'
import { RequestsPageContent } from '@/features/requests/requests-page-content'

export const metadata: Metadata = {
	title: 'Все заявки'
}

type ManagerRequestsPageProps = {
	searchParams: Promise<{
		search?: string
	}>
}

export default async function ManagerRequestsPage({
	searchParams
}: ManagerRequestsPageProps) {
	const { search } = await searchParams

	const requests = getMockRequests(search)

	return (
		<div className='flex h-full min-h-0 flex-col'>
			<RequestsPageContent
				requests={requests}
				search={search}
			/>
		</div>
	)
}
