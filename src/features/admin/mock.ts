export type AdminRegion = {
	id: string
	label: string
}

export type AdminUser = {
	id: string
	login: string
	mainRegion: string
	additionalRegions: string[]
}

export type AdminLimit = {
	id: string
	region: string
	limit: number | null
	currentBalance: number
	mutedBalance?: boolean
}

export type AdminPaymentGoal = {
	id: string
	title: string
	isActive: boolean
	isDisabled?: boolean
}

export const adminRegions: AdminRegion[] = [
	{
		id: 'all',
		label: 'Регион'
	},
	{
		id: 'region-241',
		label: 'Region 241'
	},
	{
		id: 'region-242',
		label: 'Region 242'
	},
	{
		id: 'region-243',
		label: 'Region 243'
	},
	{
		id: 'region-244',
		label: 'Region 244'
	},
	{
		id: 'region-245',
		label: 'Region 245'
	}
]

export const adminUsers: AdminUser[] = [
	{
		id: '1',
		login: 'User 012412',
		mainRegion: 'Region 241',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '2',
		login: 'User 012413',
		mainRegion: 'Region 242',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '3',
		login: 'User 012414',
		mainRegion: 'Region 243',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '4',
		login: 'User 012415',
		mainRegion: 'Region 244',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '5',
		login: 'User 012416',
		mainRegion: 'Region 245',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '6',
		login: 'User 012417',
		mainRegion: 'Region 246',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '7',
		login: 'User 012418',
		mainRegion: 'Region 247',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241'
		]
	},
	{
		id: '8',
		login: 'User 012419',
		mainRegion: 'Region 248',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '9',
		login: 'User 012420',
		mainRegion: 'Region 249',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	},
	{
		id: '10',
		login: 'User 012421',
		mainRegion: 'Region 250',
		additionalRegions: [
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112',
			'Region 241',
			'Region 112'
		]
	}
]

export const adminLimits: AdminLimit[] = [
	{
		id: '1',
		region: 'Region 241',
		limit: 1000,
		currentBalance: 2000
	},
	{
		id: '2',
		region: 'Region 242',
		limit: 25000.125,
		currentBalance: 1000
	},
	{
		id: '3',
		region: 'Region 243',
		limit: 1000,
		currentBalance: 3000
	},
	{
		id: '4',
		region: 'Region 244',
		limit: 1250.5,
		currentBalance: 15000
	},
	{
		id: '5',
		region: 'Region 245',
		limit: null,
		currentBalance: 500,
		mutedBalance: true
	},
	{
		id: '6',
		region: 'Region 246',
		limit: 25000.125,
		currentBalance: 1000
	},
	{
		id: '7',
		region: 'Region 247',
		limit: null,
		currentBalance: 2000,
		mutedBalance: true
	},
	{
		id: '8',
		region: 'Region 248',
		limit: 1250.5,
		currentBalance: 3000
	}
]

export const adminPaymentGoals: AdminPaymentGoal[] = [
	{
		id: '1',
		title:
			'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: false
	},
	{
		id: '2',
		title: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: false
	},
	{
		id: '3',
		title:
			'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: true
	},
	{
		id: '4',
		title: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: false
	},
	{
		id: '5',
		title: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: true
	},
	{
		id: '6',
		title:
			'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: false
	},
	{
		id: '7',
		title: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: true
	},
	{
		id: '8',
		title:
			'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: false
	},
	{
		id: '9',
		title: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: true
	},
	{
		id: '10',
		title:
			'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		isActive: true,
		isDisabled: true
	}
]
