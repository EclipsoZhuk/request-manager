import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import type { AdminLimit } from './mock'
import { cn } from '@/lib/utils'

type LimitsPageContentProps = {
	limits: AdminLimit[]
}

const numberFormatter = new Intl.NumberFormat('ru-RU', {
	maximumFractionDigits: 3
})

function formatAmount(value: number | null) {
	if (value === null) {
		return '-'
	}

	return numberFormatter.format(value)
}

export function LimitsPageContent({ limits }: LimitsPageContentProps) {
	return (
		<section className='flex min-h-0 flex-1 flex-col'>
			<div className='bg-card overflow-hidden rounded-xl border'>
				<div className='overflow-x-auto'>
					<Table className='min-w-[800px] table-fixed'>
						<TableHeader>
							<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
								<TableHead className='w-1/3 font-bold'>
									Основной Регион
								</TableHead>

								<TableHead className='w-1/3 font-bold'>
									Сумма лимита в USDT
								</TableHead>

								<TableHead className='w-1/3 font-bold'>
									Актуальный остаток
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{limits.map(limit => (
								<TableRow
									key={limit.id}
									className='hover:bg-muted h-[72px]'
								>
									<TableCell>{limit.region}</TableCell>

									<TableCell>{formatAmount(limit.limit)}</TableCell>

									<TableCell
										className={cn(
											limit.mutedBalance && 'text-muted-foreground/50'
										)}
									>
										{formatAmount(limit.currentBalance)}
									</TableCell>
								</TableRow>
							))}

							{limits.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={3}
										className='text-muted-foreground h-80 text-center'
									>
										Лимиты не найдены
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
