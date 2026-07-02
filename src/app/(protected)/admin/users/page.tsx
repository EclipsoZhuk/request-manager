import type { Metadata } from 'next'

import { adminUsers } from '@/features/admin/mock'
import { UsersPageContent } from '@/features/admin/users-page-content'

export const metadata: Metadata = {
	title: 'Пользователи'
}

export default function AdminUsersPage() {
	return <UsersPageContent users={adminUsers} />
}
