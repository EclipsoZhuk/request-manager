import type { UserRole } from '@/features/auth/schema'

export type NavigationItem = {
	label: string
	href: string
}

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
	manager: [
		{
			label: 'Главная',
			href: '/manager'
		}
	],

	admin: [
		{
			label: 'Главная',
			href: '/admin'
		}
	]
}
