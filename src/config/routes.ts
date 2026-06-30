export const ROUTE_TITLES: Record<string, string> = {
	'/manager/requests': 'Все заявки',
	'/manager/requests/create': 'Создать заявку',
	'/manager/statistics': 'Статистика',

	'/admin/requests': 'Все заявки',
	'/admin/statistics': 'Статистика',
	'/admin/users': 'Пользователи',
	'/admin/payment-goals': 'Цели оплат',
	'/admin/limits': 'Лимиты'
}

export function getRouteTitle(pathname: string) {
	const matchedRoute = Object.keys(ROUTE_TITLES)
		.sort((a, b) => b.length - a.length)
		.find(route => pathname === route || pathname.startsWith(`${route}/`))

	return matchedRoute ? ROUTE_TITLES[matchedRoute] : 'Request Manager'
}
