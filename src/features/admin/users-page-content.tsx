'use client'

import { Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { type AdminRegion, type AdminUser, adminRegions } from './mock'

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
		<section className='flex min-h-0 flex-1 flex-col gap-4'>
			<Select
				value={selectedRegion}
				onValueChange={setSelectedRegion}
			>
				<SelectTrigger className='bg-card h-11 w-45 rounded-xl border-0 px-5 font-semibold shadow-none'>
					<SelectValue placeholder='Регион' />
				</SelectTrigger>

				<SelectContent className='rounded-xl'>
					{regions.map(region => (
						<SelectItem
							key={region.id}
							value={region.id}
						>
							{region.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className='bg-card overflow-hidden rounded-xl border'>
				<div className='overflow-x-auto'>
					<Table className='min-w-[1050px] table-fixed'>
						<TableHeader>
							<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
								<TableHead className='w-[25%] font-bold'>
									Логин пользователя
								</TableHead>

								<TableHead className='w-[25%] font-bold'>
									Основной Регион
								</TableHead>

								<TableHead>Дополнительные Регионы</TableHead>

								<TableHead className='w-[10%] text-center font-bold'>
									Изменить
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredUsers.map(user => (
								<TableRow
									key={user.id}
									className='hover:bg-muted h-[72px]'
								>
									<TableCell>{user.login}</TableCell>

									<TableCell>{user.mainRegion}</TableCell>

									<TableCell className='truncate leading-5'>
										{user.additionalRegions.join(', ')}
									</TableCell>

									<TableCell className='text-center'>
										<Button
											type='button'
											variant='outline'
											size='icon'
											aria-label={`Редактировать ${user.login}`}
											className='border-primary text-primary size-10 rounded-xl'
										>
											<Pencil className='size-4' />
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
