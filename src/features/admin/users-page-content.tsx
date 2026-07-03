'use client'

import { Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { type AdminRegion, type AdminUser, adminRegions } from './mock'
import { UsersFilter } from './users-filter'

type UsersPageContentProps = {
	users: AdminUser[]
	regions?: AdminRegion[]
}

export function UsersPageContent({
	users,
	regions = adminRegions
}: UsersPageContentProps) {
	const [selectedRegion, setSelectedRegion] = useState('all')

	const filteredUsers = useMemo(() => {
		if (selectedRegion === 'all') {
			return users
		}

		const selectedRegionData = regions.find(
			region => region.id === selectedRegion
		)

		if (!selectedRegionData) {
			return users
		}

		return users.filter(user => {
			return (
				user.mainRegion === selectedRegionData.label ||
				user.additionalRegions.includes(selectedRegionData.label)
			)
		})
	}, [regions, selectedRegion, users])

	return (
		<section className='flex h-full min-h-0 flex-col gap-5'>
			<div className='flex shrink-0 items-center justify-between gap-4'>
				<div className='flex min-w-0 flex-wrap items-center gap-5'>
					<UsersFilter
						regions={regions}
						setSelectedRegion={setSelectedRegion}
					/>
				</div>
			</div>

			<div className='bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border'>
				<div className='relative min-h-0 flex-1 overflow-auto'>
					<Table className='min-w-262 table-fixed'>
						<TableHeader>
							<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
								<TableHead className='w-[25%]'>Логин пользователя</TableHead>
								<TableHead className='w-[25%]'>Основной Регион</TableHead>
								<TableHead>Дополнительные Регионы</TableHead>
								<TableHead className='w-[10%]'>Изменить</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredUsers.map(user => (
								<TableRow
									key={user.id}
									className='h-18'
								>
									<TableCell>{user.login}</TableCell>
									<TableCell>{user.mainRegion}</TableCell>
									<TableCell className='truncate'>
										{user.additionalRegions.join(', ')}
									</TableCell>

									<TableCell>
										<Button
											type='button'
											variant='outline'
											size='icon'
											aria-label={`Редактировать ${user.login}`}
										>
											<Pencil />
										</Button>
									</TableCell>
								</TableRow>
							))}

							{filteredUsers.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={4}
										className='text-muted-foreground h-80 text-center'
									>
										Пользователи не найдены
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</section>
	)
}
