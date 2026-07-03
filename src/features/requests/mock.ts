import 'server-only'

export type RequestStatus = 'cancelled' | 'in_progress' | 'paid'

export type RequestListItem = {
	id: string
	createdAt: string
	creator: string
	regions: string
	amount: number
	wallet: string
	paymentGoal: string
	lifetime: string
	status: RequestStatus
	txnHash: string
	hasScreenshot: boolean
}

export const MOCK_REQUESTS: RequestListItem[] = [
	{
		id: '0001',
		createdAt: '29.05.2026',
		creator: 'User 012412',
		regions: 'Region 241, Region 112 + еще 3.',
		amount: 5000,
		wallet: 'T2asHcasddas24Ar',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'cancelled',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0002',
		createdAt: '14.03.2026',
		creator: 'User 012413',
		regions: 'Region 53',
		amount: 6000,
		wallet: 'G3ksJf4ash12Ta',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'in_progress',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0003',
		createdAt: '22.04.2026',
		creator: 'User 012414',
		regions: 'Region 95, Region 67 + еще 4.',
		amount: 7000,
		wallet: 'R8lmNd9opqsF23Bc',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0004',
		createdAt: '05.05.2026',
		creator: 'User 012415',
		regions: 'Region 31, Region 84',
		amount: 8000,
		wallet: 'W2qeJh5tmwrX14Me',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0005',
		createdAt: '18.05.2026',
		creator: 'User 012416',
		regions: 'Region 12',
		amount: 9000,
		wallet: 'X5huPz8qkdsC56Js',
		paymentGoal: 'Lorem',
		lifetime: '1 час',
		status: 'in_progress',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0006',
		createdAt: '29.05.2026',
		creator: 'User 012417',
		regions: 'Region 45, Region 76 + еще 3.',
		amount: 10000,
		wallet: 'V1mnZs2jhtyR65Lo',
		paymentGoal: 'Lorem',
		lifetime: '1 час',
		status: 'cancelled',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0007',
		createdAt: '03.06.2026',
		creator: 'User 012418',
		regions: 'Region 88, Region 29',
		amount: 11000,
		wallet: 'A7qxLk3mzdfW34Vr',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'in_progress',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0008',
		createdAt: '15.06.2026',
		creator: 'User 012419',
		regions: 'Region 54, Region 11 + еще 6.',
		amount: 12000,
		wallet: 'D4jvXs9qtplK12Ub',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0009',
		createdAt: '27.06.2026',
		creator: 'User 012420',
		regions: 'Region 77',
		amount: 13000,
		wallet: 'F8zrQe6bvhwH45Qx',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0010',
		createdAt: '10.07.2026',
		creator: 'User 012421',
		regions: 'Region 18, Region 63 + еще 4.',
		amount: 14000,
		wallet: 'J9ytMb2wzckN78Yp',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'cancelled',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0011',
		createdAt: '29.05.2026',
		creator: 'User 012417',
		regions: 'Region 45, Region 76 + еще 3.',
		amount: 10000,
		wallet: 'V1mnZs2jhtyR65Lo',
		paymentGoal: 'Lorem',
		lifetime: '1 час',
		status: 'cancelled',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0012',
		createdAt: '03.06.2026',
		creator: 'User 012418',
		regions: 'Region 88, Region 29',
		amount: 11000,
		wallet: 'A7qxLk3mzdfW34Vr',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'in_progress',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0013',
		createdAt: '15.06.2026',
		creator: 'User 012419',
		regions: 'Region 54, Region 11 + еще 6.',
		amount: 12000,
		wallet: 'D4jvXs9qtplK12Ub',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0014',
		createdAt: '27.06.2026',
		creator: 'User 012420',
		regions: 'Region 77',
		amount: 13000,
		wallet: 'F8zrQe6bvhwH45Qx',
		paymentGoal: 'Lorem',
		lifetime: '30 мин',
		status: 'paid',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	},
	{
		id: '0015',
		createdAt: '10.07.2026',
		creator: 'User 012421',
		regions: 'Region 18, Region 63 + еще 4.',
		amount: 14000,
		wallet: 'J9ytMb2wzckN78Yp',
		paymentGoal: 'Lorem',
		lifetime: '2 часа',
		status: 'cancelled',
		txnHash: 'T2asHcasddas24Ar',
		hasScreenshot: true
	}
]

export function getMockRequests(search?: string) {
	const normalizedSearch = search?.trim().toLowerCase()

	if (!normalizedSearch) {
		return MOCK_REQUESTS
	}

	return MOCK_REQUESTS.filter(request => {
		return (
			request.wallet.toLowerCase().includes(normalizedSearch) ||
			request.txnHash.toLowerCase().includes(normalizedSearch) ||
			request.creator.toLowerCase().includes(normalizedSearch)
		)
	})
}

export type CreateRequestRegion = {
	id: string
	label: string
	limit: number
}

export type CreateRequestPaymentGoal = {
	id: string
	label: string
}

export type CreateRequestLifetime = {
	id: string
	label: string
	minutes: number
}

export const createRequestRegions: CreateRequestRegion[] = [
	{
		id: 'region-21',
		label: 'Регион 21',
		limit: 2000
	},
	{
		id: 'region-53',
		label: 'Регион 53',
		limit: 4000
	},
	{
		id: 'region-5411',
		label: 'Регион 5411',
		limit: 8000
	},
	{
		id: 'region-5412',
		label: 'Регион 5412',
		limit: 5000
	}
]

export const createRequestPaymentGoals: CreateRequestPaymentGoal[] = [
	{
		id: 'goal-1',
		label: 'Оплата рекламной кампании'
	},
	{
		id: 'goal-2',
		label: 'Оплата услуг подрядчика'
	},
	{
		id: 'goal-3',
		label: 'Lorem ipsum dolar Lorem ipsum dolar'
	}
]

export const createRequestLifetimes: CreateRequestLifetime[] = [
	{
		id: '30-minutes',
		label: '30 минут',
		minutes: 30
	},
	{
		id: '1-hour',
		label: '1 час',
		minutes: 60
	},
	{
		id: '2-hours',
		label: '2 часа',
		minutes: 120
	}
]
