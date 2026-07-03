import type { Metadata } from 'next'

import { adminUsers } from '@/features/admin/mock'
import { UsersPageContent } from '@/features/admin/users-page-content'

export const metadata: Metadata = {
	title: 'Пользователи'
}

export default function AdminUsersPage() {
	return (
		<div className='h-full min-h-0'>
			<UsersPageContent users={adminUsers} />
		</div>
	)
}
