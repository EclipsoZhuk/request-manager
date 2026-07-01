'use client'

import { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const FILTER_ITEMS = [
	'Период создания',
	'Регион',
	'Создатель',
	'Цель оплаты',
	'Статус',
	'Наличие Txn Hash',
	'Наличие скриншота'
]

export function RequestFilter() {
	const [filter, setFilter] = useState('')

	return (
		<Select
			value={filter}
			onValueChange={setFilter}
		>
			<SelectTrigger className='bg-card text-foreground data-placeholder:text-foreground max-h-11 w-45 rounded-xl border-0 px-5 text-sm font-bold'>
				<SelectValue placeholder='Фильтр' />
			</SelectTrigger>

			<SelectContent
				position='popper'
				align='start'
				sideOffset={4}
				className='bg-card ring-foreground/0 w-45 rounded-xl shadow'
			>
				{FILTER_ITEMS.map(item => (
					<SelectItem
						key={item}
						value={item}
						className='h-10 rounded-lg px-2.5 text-sm font-bold'
					>
						{item}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
