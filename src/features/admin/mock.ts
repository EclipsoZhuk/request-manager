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
	{ id: 'all', label: 'Все регионы' },
	{ id: 'region-241', label: 'Регион 222' },
	{ id: 'region-242', label: 'Регион Альфа' },
	{ id: 'region-243', label: 'Регион Бета' },
	{ id: 'region-244', label: 'Регион Гамма' },
	{ id: 'region-245', label: 'Регион Дельта' }
]

export const adminUsers: AdminUser[] = [
	{
		id: '1',
		login: 'User 012412',
		mainRegion: 'Регион 222',
		additionalRegions: [
			'Регион 222',
			'Регион 112',
			'Регион 222',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '2',
		login: 'User 012413',
		mainRegion: 'Регион Альфа',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '3',
		login: 'User 012414',
		mainRegion: 'Регион Бета',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '4',
		login: 'User 012415',
		mainRegion: 'Регион Гамма',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '5',
		login: 'User 012416',
		mainRegion: 'Регион Дельта',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '6',
		login: 'User 012417',
		mainRegion: 'Регион 246',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '7',
		login: 'User 012418',
		mainRegion: 'Регион 247',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241'
		]
	},
	{
		id: '8',
		login: 'User 012419',
		mainRegion: 'Регион 248',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '9',
		login: 'User 012420',
		mainRegion: 'Регион 249',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	},
	{
		id: '10',
		login: 'User 012421',
		mainRegion: 'Регион 250',
		additionalRegions: [
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112',
			'Регион 241',
			'Регион 112'
		]
	}
]

export const adminLimits: AdminLimit[] = [
	{
		id: '1',
		region: 'Регион 241',
		limit: 1000,
		currentBalance: 2000
	},
	{
		id: '2',
		region: 'Регион 242',
		limit: 25000.125,
		currentBalance: 1000
	},
	{
		id: '3',
		region: 'Регион 243',
		limit: 1000,
		currentBalance: 3000
	},
	{
		id: '4',
		region: 'Регион 244',
		limit: 1250.5,
		currentBalance: 15000
	},
	{
		id: '5',
		region: 'Регион 245',
		limit: null,
		currentBalance: 500,
		mutedBalance: true
	},
	{
		id: '6',
		region: 'Регион 246',
		limit: 25000.125,
		currentBalance: 1000
	},
	{
		id: '7',
		region: 'Регион 247',
		limit: null,
		currentBalance: 2000,
		mutedBalance: true
	},
	{
		id: '8',
		region: 'Регион 248',
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
