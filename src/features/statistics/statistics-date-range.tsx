'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale/ru'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'

type StatisticsDateRangeProps = {
	value?: DateRange
	onChange: (value?: DateRange) => void
}

type PresetItem = {
	label: string
	getRange: () => DateRange
}

function startOfDay(date: Date) {
	const result = new Date(date)
	result.setHours(0, 0, 0, 0)

	return result
}

function addDays(date: Date, days: number) {
	const result = new Date(date)
	result.setDate(result.getDate() + days)

	return result
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function formatDate(date?: Date) {
	if (!date) {
		return '—'
	}

	return new Intl.DateTimeFormat('ru-RU').format(date)
}

const PRESETS: PresetItem[] = [
	{
		label: 'Cегодня',
		getRange: () => {
			const today = startOfDay(new Date())

			return {
				from: today,
				to: today
			}
		}
	},
	{
		label: 'Вчера',
		getRange: () => {
			const yesterday = addDays(startOfDay(new Date()), -1)

			return {
				from: yesterday,
				to: yesterday
			}
		}
	},
	{
		label: 'Последние 7 дней',
		getRange: () => {
			const today = startOfDay(new Date())

			return {
				from: addDays(today, -6),
				to: today
			}
		}
	},
	{
		label: 'Последние 30 дней',
		getRange: () => {
			const today = startOfDay(new Date())

			return {
				from: addDays(today, -29),
				to: today
			}
		}
	},
	{
		label: 'Этот месяц',
		getRange: () => {
			const today = startOfDay(new Date())

			return {
				from: startOfMonth(today),
				to: today
			}
		}
	},
	{
		label: 'Прошлый месяц',
		getRange: () => {
			const today = new Date()
			const previousMonth = new Date(
				today.getFullYear(),
				today.getMonth() - 1,
				1
			)

			return {
				from: startOfMonth(previousMonth),
				to: endOfMonth(previousMonth)
			}
		}
	}
]

export function StatisticsDateRange({
	value,
	onChange
}: StatisticsDateRangeProps) {
	const [open, setOpen] = useState(false)
	const [draftRange, setDraftRange] = useState<DateRange | undefined>(value)
	const [calendarMonth, setCalendarMonth] = useState(value?.from ?? new Date())
	const [activePreset, setActivePreset] = useState<string>()

	function handleOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setDraftRange(value)
			setCalendarMonth(value?.from ?? new Date())
		}

		setOpen(nextOpen)
	}

	function handlePresetSelect(preset: PresetItem) {
		const range = preset.getRange()

		setActivePreset(preset.label)
		setDraftRange(range)
		setCalendarMonth(range.from ?? new Date())
	}

	function handleCancel() {
		setDraftRange(value)
		setOpen(false)
	}

	function handleApply() {
		onChange(draftRange)
		setOpen(false)
	}

	const triggerLabel =
		value?.from && value?.to
			? `${formatDate(value.from)} - ${formatDate(value.to)}`
			: 'Выберите период'

	return (
		<Popover
			open={open}
			onOpenChange={handleOpenChange}
		>
			<PopoverTrigger asChild>
				<Button
					type='button'
					variant='default'
					className='bg-card hover:bg-card text-foreground h-11 w-60 shrink-0 justify-between rounded-xl px-5 text-sm font-bold shadow-none'
				>
					<span className='truncate'>{triggerLabel}</span>
					<ChevronDown
						className={cn('size-4 transition-transform', open && 'rotate-180')}
					/>
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				sideOffset={8}
				className='w-auto overflow-hidden rounded-xl border-0 p-0 shadow-2xl'
			>
				<div className='flex'>
					<div className='w-45 shrink-0 border-r p-3'>
						<div className='space-y-1'>
							{PRESETS.map(preset => (
								<button
									key={preset.label}
									type='button'
									onClick={() => handlePresetSelect(preset)}
									className={cn(
										'hover:bg-muted flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium transition-colors',
										activePreset === preset.label &&
											'bg-primary/10 text-primary'
									)}
								>
									{preset.label}
								</button>
							))}

							<button
								type='button'
								onClick={() => setActivePreset('custom')}
								className={cn(
									'hover:bg-muted flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium transition-colors',
									activePreset === 'custom' && 'bg-primary/10 text-primary'
								)}
							>
								Свой период
							</button>
						</div>
					</div>

					<div>
						<Calendar
							mode='range'
							selected={draftRange}
							onSelect={range => {
								setDraftRange(range)
								setActivePreset('custom')
							}}
							locale={ru}
							month={calendarMonth}
							onMonthChange={setCalendarMonth}
							numberOfMonths={2}
							className='p-4'
						/>

						<div className='flex items-center justify-between gap-5 border-t p-3'>
							<div className='flex items-center gap-3'>
								<div className='flex h-10 min-w-30 items-center justify-center rounded-lg border px-3 text-sm font-medium'>
									{formatDate(draftRange?.from)}
								</div>

								<span className='text-muted-foreground'>—</span>

								<div className='flex h-10 min-w-30 items-center justify-center rounded-lg border px-3 text-sm font-medium'>
									{formatDate(draftRange?.to)}
								</div>
							</div>

							<div className='flex items-center gap-3'>
								<Button
									type='button'
									variant='outline'
									onClick={handleCancel}
									className='text-primary border-primary h-10 rounded-lg px-7'
								>
									Cancel
								</Button>

								<Button
									type='button'
									onClick={handleApply}
									disabled={!draftRange?.from || !draftRange?.to}
									className='h-10 rounded-lg px-7'
								>
									Apply
								</Button>
							</div>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
