'use client'

import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

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
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type='button'
					variant='secondary'
					className='h-10 w-[160px] justify-between rounded-xl bg-white px-4 text-sm font-semibold hover:bg-white'
				>
					Фильтр
					<ChevronDown className='size-4' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				sideOffset={8}
				className='w-[190px] rounded-xl border-0 bg-white p-2 shadow-md'
			>
				{FILTER_ITEMS.map((item, index) => (
					<DropdownMenuItem
						key={item}
						className={
							index === 0
								? 'bg-muted focus:bg-muted h-10 rounded-lg px-3 text-sm font-semibold'
								: 'h-10 rounded-lg px-3 text-sm font-semibold'
						}
					>
						{item}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
