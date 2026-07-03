'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import type { PaymentGoalStatistics, StatisticsRegion } from './mock'
import { StatisticsDateRange } from './statistics-date-range'
import { StatisticsFilter } from './statistics-filter'

type StatisticsPageContentProps = {
	regions: StatisticsRegion[]
	paymentGoals: PaymentGoalStatistics[]
	variant?: 'manager' | 'admin'
}

const FIRST_COLUMN_CLASS = 'sticky left-0 z-10 w-85 min-w-85 max-w-85'

const REGION_COLUMN_CLASS = 'w-35 min-w-35'

export function StatisticsPageContent({
	regions,
	paymentGoals,
	variant = 'manager'
}: StatisticsPageContentProps) {
	const [selectedRegion, setSelectedRegion] = useState(regions[0]?.id ?? '')

	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		return {
			from: today,
			to: new Date(today)
		}
	})

	const selectedRegionData = regions.find(
		region => region.id === selectedRegion
	)

	const totalExpense = regions.reduce(
		(total, region) => total + region.totalExpense,
		0
	)

	const totalRemainingLimit = regions.reduce(
		(total, region) => total + region.remainingLimit,
		0
	)

	return (
		<section className='flex h-full min-h-0 flex-col gap-4'>
			<div className='flex shrink-0 items-center justify-between gap-4'>
				<div className='flex min-w-0 flex-wrap items-center gap-4'>
					{variant === 'manager' && (
						<>
							<StatisticsFilter
								regions={regions}
								setSelectedRegion={setSelectedRegion}
							/>

							<StatisticCard
								label='Общая сумма расходов'
								value={totalExpense}
							/>

							<StatisticCard
								label='Остаток лимита'
								value={
									selectedRegionData?.remainingLimit ?? totalRemainingLimit
								}
							/>
						</>
					)}
				</div>

				<StatisticsDateRange
					value={dateRange}
					onChange={setDateRange}
				/>
			</div>

			{variant === 'manager' && (
				<div className='bg-card shrink-0 overflow-hidden rounded-xl border'>
					<div className='overflow-x-auto'>
						<Table className='min-w-[1730px] table-fixed'>
							<TableHeader>
								<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
									<TableHead
										className={`${FIRST_COLUMN_CLASS} z-30 bg-[#FCFDFD]`}
									/>

									{regions.map(region => (
										<TableHead
											key={region.id}
											className={REGION_COLUMN_CLASS}
										>
											{region.label}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>

							<TableBody>
								<TableRow className='bg-primary/10 hover:bg-primary/10 h-14.5'>
									<TableCell
										className={`${FIRST_COLUMN_CLASS} bg-[#E7EEFC] font-bold`}
									>
										TOTAL РАСХОД
									</TableCell>

									{regions.map(region => (
										<TableCell
											key={region.id}
											className={REGION_COLUMN_CLASS}
										>
											{region.totalExpense}
										</TableCell>
									))}
								</TableRow>

								<TableRow className='bg-primary/10 hover:bg-primary/10 h-14.5'>
									<TableCell
										className={`${FIRST_COLUMN_CLASS} bg-[#E7EEFC] font-bold`}
									>
										TOTAL ОСТАТОК ЛИМИТА
									</TableCell>

									{regions.map(region => (
										<TableCell
											key={region.id}
											className={REGION_COLUMN_CLASS}
										>
											{region.remainingLimit}
										</TableCell>
									))}
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			<div className='bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border'>
				<div className='relative min-h-0 flex-1 overflow-auto'>
					<Table className='min-w-[1730px] table-fixed'>
						<TableHeader>
							<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
								<TableHead
									className={`${FIRST_COLUMN_CLASS} top-0 z-40 bg-[#FCFDFD] font-bold`}
								>
									<div className='flex items-center gap-1'>Цели оплат</div>
								</TableHead>

								{regions.map(region => (
									<TableHead
										key={region.id}
										className={`${REGION_COLUMN_CLASS} sticky top-0 z-20 bg-[#FCFDFD]`}
									>
										{region.label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{paymentGoals.map(paymentGoal => (
								<TableRow
									key={paymentGoal.id}
									className='group h-14.5'
								>
									<TableCell
										className={`${FIRST_COLUMN_CLASS} bg-card group-hover:bg-muted`}
									>
										<p className='line-clamp-2 leading-5'>
											{paymentGoal.title}
										</p>
									</TableCell>

									{regions.map(region => (
										<TableCell
											key={region.id}
											className={REGION_COLUMN_CLASS}
										>
											{paymentGoal.values[region.id] ?? 0}
										</TableCell>
									))}
								</TableRow>
							))}

							{paymentGoals.length === 0 && (
								<TableRow className='hover:bg-card'>
									<TableCell
										colSpan={regions.length + 1}
										className='text-muted-foreground h-80 text-center'
									>
										Статистика не найдена
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className='grid shrink-0 grid-cols-2 gap-5'>
				<Button
					type='button'
					variant='outline'
					size='lg'
				>
					Экспорт CSV
					<Download className='size-6' />
				</Button>

				<Button
					type='button'
					variant='outline'
					size='lg'
				>
					Экспорт XLSX
					<Download className='size-6' />
				</Button>
			</div>
		</section>
	)
}

type StatisticCardProps = {
	label: string
	value: number
}

function StatisticCard({ label, value }: StatisticCardProps) {
	return (
		<div className='bg-primary/20 text-primary flex h-11 items-center gap-2.5 rounded-lg px-3 font-bold'>
			<span>{label}</span>
			<span className='text-base'>
				{new Intl.NumberFormat('ru-RU').format(value)}
			</span>
		</div>
	)
}
