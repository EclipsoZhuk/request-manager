import type { Metadata } from 'next'

import { getMockRequests } from '@/features/requests/mock'
import { RequestsPageContent } from '@/features/requests/requests-page-content'

export const metadata: Metadata = {
	title: 'Все заявки'
}

type AdminRequestsPageProps = {
	searchParams: Promise<{
		search?: string
	}>
}

export default async function AdminRequestsPage({
	searchParams
}: AdminRequestsPageProps) {
	const { search } = await searchParams

	return (
		<RequestsPageContent
			requests={getMockRequests(search)}
			role='admin'
			search={search}
		/>
	)
}
