import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { type RequestListItem, type RequestStatus } from './mock'
import { RequestFilter } from './request-filter'
import { cn } from '@/lib/utils'

type RequestsPageContentProps = {
	requests: RequestListItem[]
	search?: string
}

const STATUS_CONFIG: Record<
	RequestStatus,
	{
		label: string
		className: string
	}
> = {
	cancelled: {
		label: 'Cancelled',
		className: 'bg-[#ffe0eb] text-[#e85f91]'
	},
	in_progress: {
		label: 'In Progress',
		className: 'bg-[#ffe9d8] text-[#e88743]'
	},
	paid: {
		label: 'Paid',
		className: 'bg-[#dcf7d2] text-[#58a848]'
	}
}

function shortenValue(value: string) {
	if (value.length <= 15) {
		return value
	}

	return `${value.slice(0, 8)}...${value.slice(-7)}`
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
	const config = STATUS_CONFIG[status]

	return (
		<span
			className={cn(
				'inline-flex min-h-6 items-center rounded-lg px-2.5 py-1 text-[11px] leading-none font-bold whitespace-nowrap',
				config.className
			)}
		>
			{config.label}
		</span>
	)
}

export function RequestsPageContent({
	requests,
	search = ''
}: RequestsPageContentProps) {
	return (
		<section className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<form
					method='get'
					className='relative w-full max-w-[340px]'
				>
					<Search
						aria-hidden='true'
						className='text-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2'
					/>

					<Input
						type='search'
						name='search'
						defaultValue={search}
						placeholder='Поиск по (Адрес кошелька, Txn Hash)'
						className='h-10 rounded-xl border-0 bg-white pr-4 pl-11 text-sm font-semibold shadow-none'
					/>
				</form>

				<RequestFilter />
			</div>

			<div className='bg-card overflow-hidden rounded-xl border'>
				<div className='overflow-x-auto'>
					<Table className='min-w-[1180px]'>
						<TableHeader>
							<TableRow className='h-12 bg-white hover:bg-white'>
								<TableHead className='text-foreground w-[70px] px-4 text-xs font-bold'>
									ID
								</TableHead>

								<TableHead className='text-foreground w-[110px] px-3 text-xs font-bold'>
									Дата создания
								</TableHead>

								<TableHead className='text-foreground w-[145px] px-3 text-xs font-bold'>
									Создатель заявки
								</TableHead>

								<TableHead className='text-foreground w-[170px] px-3 text-xs font-bold'>
									Регион
								</TableHead>

								<TableHead className='text-foreground w-[80px] px-3 text-xs font-bold'>
									Сумма
								</TableHead>

								<TableHead className='text-foreground w-[135px] px-3 text-xs font-bold'>
									Адрес
								</TableHead>

								<TableHead className='text-foreground w-[95px] px-3 text-xs font-bold'>
									Цель
								</TableHead>

								<TableHead className='text-foreground w-[105px] px-3 text-xs font-bold'>
									Срок жизни
								</TableHead>

								<TableHead className='text-foreground w-[105px] px-3 text-xs font-bold'>
									Статус
								</TableHead>

								<TableHead className='text-foreground w-[135px] px-3 text-xs font-bold'>
									Txn Hash
								</TableHead>

								<TableHead className='text-foreground w-[120px] px-3 text-center text-xs font-bold'>
									Скриншот
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{requests.map(request => (
								<TableRow
									key={request.id}
									className='hover:bg-muted/20 h-[58px]'
								>
									<TableCell className='px-4 text-xs font-medium'>
										{request.id}
									</TableCell>

									<TableCell className='px-3 text-xs whitespace-nowrap'>
										{request.createdAt}
									</TableCell>

									<TableCell className='px-3 text-xs whitespace-nowrap'>
										{request.creator}
									</TableCell>

									<TableCell className='max-w-[170px] px-3 text-xs leading-4'>
										{request.regions}
									</TableCell>

									<TableCell className='text-primary px-3 text-xs font-bold'>
										{request.amount}
									</TableCell>

									<TableCell
										title={request.wallet}
										className='px-3 text-xs whitespace-nowrap'
									>
										{shortenValue(request.wallet)}
									</TableCell>

									<TableCell className='px-3 text-xs'>
										{request.paymentGoal}
									</TableCell>

									<TableCell className='px-3 text-xs whitespace-nowrap'>
										{request.lifetime}
									</TableCell>

									<TableCell className='px-3'>
										<RequestStatusBadge status={request.status} />
									</TableCell>

									<TableCell
										title={request.txnHash}
										className='px-3 text-xs whitespace-nowrap'
									>
										{shortenValue(request.txnHash)}
									</TableCell>

									<TableCell className='px-3 text-center'>
										{request.hasScreenshot ? (
											<Button
												type='button'
												variant='outline'
												className='border-primary text-primary hover:bg-primary/5 hover:text-primary h-9 min-w-[92px] rounded-xl text-xs font-bold'
											>
												SCRN
											</Button>
										) : (
											<span className='text-muted-foreground'>—</span>
										)}
									</TableCell>
								</TableRow>
							))}

							{requests.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={11}
										className='text-muted-foreground h-40 text-center'
									>
										Заявки не найдены
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
