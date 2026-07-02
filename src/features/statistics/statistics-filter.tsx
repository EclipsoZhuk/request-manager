'use client'

import { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import { StatisticsRegion } from './mock'

export function StatisticsFilter({
	regions,
	setSelectedRegion
}: {
	regions: StatisticsRegion[]
	setSelectedRegion: (regionId: string) => void
}) {
	const [filter, setFilter] = useState('')

	return (
		<Select
			value={filter}
			onValueChange={value => {
				setFilter(value)
				setSelectedRegion(value)
			}}
		>
			<SelectTrigger className='bg-card text-foreground data-placeholder:text-foreground max-h-11 w-45 rounded-xl border-0 px-5 text-sm font-bold'>
				<SelectValue placeholder='Регион' />
			</SelectTrigger>

			<SelectContent
				position='popper'
				align='start'
				sideOffset={4}
				className='bg-card ring-foreground/0 w-45 rounded-xl shadow'
			>
				{regions.map(region => (
					<SelectItem
						key={region.id}
						value={region.id}
						className='h-10 rounded-lg px-2.5 text-sm font-bold'
					>
						{region.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
