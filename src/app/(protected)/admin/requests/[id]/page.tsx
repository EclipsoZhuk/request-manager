import type { Metadata } from 'next'

import { RequestDetailPageContent } from '@/features/requests/request-detail-page-content'

type AdminRequestDetailPageProps = {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({
	params
}: AdminRequestDetailPageProps): Promise<Metadata> {
	const { id } = await params

	return {
		title: `Заявка ID ${id}`
	}
}

export default function AdminRequestDetailPage() {
	return <RequestDetailPageContent />
}
