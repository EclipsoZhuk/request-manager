import type { Metadata } from 'next'

import { CreateRequestPageContent } from '@/features/requests/create-request-page-content'
import {
	createRequestLifetimes,
	createRequestPaymentGoals,
	createRequestRegions
} from '@/features/requests/mock'

export const metadata: Metadata = {
	title: 'Создать заявку'
}

export default function CreateRequestPage() {
	return (
		<CreateRequestPageContent
			regions={createRequestRegions}
			paymentGoals={createRequestPaymentGoals}
			lifetimes={createRequestLifetimes}
		/>
	)
}
