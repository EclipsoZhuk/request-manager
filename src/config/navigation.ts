import type { UserRole } from '@/features/auth/schema'

export type NavigationLink = {
	type: 'link'
	label: string
	href: string
}

export type NavigationGroup = {
	type: 'group'
	label: string
	children: NavigationLink[]
}

export type NavigationItem = NavigationLink | NavigationGroup

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
	manager: [
		{
			type: 'link',
			label: 'Все заявки',
			href: '/manager/requests'
		},
		{
			type: 'link',
			label: 'Создать заявку',
			href: '/manager/requests/create'
		},
		{
			type: 'link',
			label: 'Статистика',
			href: '/manager/statistics'
		}
	],

	admin: [
		{
			type: 'link',
			label: 'Все заявки',
			href: '/admin/requests'
		},
		{
			type: 'link',
			label: 'Статистика',
			href: '/admin/statistics'
		},
		{
			type: 'group',
			label: 'Панель администратора',
			children: [
				{
					type: 'link',
					label: 'Пользователи',
					href: '/admin/users'
				},
				{
					type: 'link',
					label: 'Цели оплат',
					href: '/admin/payment-goals'
				},
				{
					type: 'link',
					label: 'Лимиты',
					href: '/admin/limits'
				}
			]
		}
	]
}
