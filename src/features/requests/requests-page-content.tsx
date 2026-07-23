'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
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
import type { UserRole } from '@/features/auth/schema'
import { cn } from '@/lib/utils'

type RequestsPageContentProps = {
	requests: RequestListItem[]
	role: UserRole
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
		className: 'bg-chart-4/20 text-chart-4'
	},
	in_progress: {
		label: 'In Progress',
		className: 'bg-chart-3/20 text-chart-3'
	},
	paid: {
		label: 'Paid',
		className: 'bg-[#79FF4833] text-chart-2'
	}
}

function shortenValue(value: string) {
	if (value.length <= 15) {
		return value
	}

	return `${value.slice(0, 8)}...${value.slice(-7)}`
}

type RequestStatusBadgeProps = {
	status: RequestStatus
	onCancel?: () => void
}

function RequestStatusBadge({ status, onCancel }: RequestStatusBadgeProps) {
	const config = STATUS_CONFIG[status]

	return (
		<div
			className={cn(
				'inline-flex min-h-5.5 items-center rounded-xl px-2 py-1 text-[10px] leading-none font-bold whitespace-nowrap',
				config.className
			)}
		>
			<span>{config.label}</span>

			{status === 'in_progress' && onCancel && (
				<button
					type='button'
					onClick={onCancel}
					aria-label='Отменить заявку'
					className='ml-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-current transition-opacity hover:opacity-70'
				>
					<X className='size-2.5 stroke-[2.5]' />
				</button>
			)}
		</div>
	)
}

export function RequestsPageContent({
	requests,
	role,
	search = ''
}: RequestsPageContentProps) {
	const canManage = role === 'admin'

	const [requestItems, setRequestItems] = useState<RequestListItem[]>(
		() => requests
	)

	const [requestToCancel, setRequestToCancel] =
		useState<RequestListItem | null>(null)

	function handleDialogOpenChange(open: boolean) {
		if (!open) {
			setRequestToCancel(null)
		}
	}

	function handleConfirmCancel() {
		if (!requestToCancel) {
			return
		}

		setRequestItems(currentRequests =>
			currentRequests.map(request =>
				request.id === requestToCancel.id
					? { ...request, status: 'cancelled' }
					: request
			)
		)

		setRequestToCancel(null)
	}

	return (
		<>
			<section className='flex min-h-0 flex-1 flex-col gap-5'>
				<div className='flex items-center justify-between gap-3'>
					<form
						method='get'
						className='relative w-full max-w-85'
					>
						<Image
							src='/images/icons/search-lg.svg'
							alt='Search'
							width={18}
							height={18}
							unoptimized
							priority
							className='absolute top-1/2 left-5 size-4.5 -translate-y-1/2'
						/>

						<Input
							type='search'
							name='search'
							defaultValue={search}
							placeholder='Поиск по (Адрес кошелька, Txn Hash)'
							className='bg-card placeholder:text-foreground h-11 rounded-xl border-0 pr-2 pl-13.5 text-sm font-bold'
						/>
					</form>

					<RequestFilter />
				</div>

				<div className='bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border'>
					<div className='min-h-0 flex-1 overflow-auto'>
						<Table className='min-w-295'>
							<TableHeader>
								<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
									<TableHead>ID</TableHead>
									<TableHead>Дата создания</TableHead>
									<TableHead>Создатель заявки</TableHead>
									<TableHead>Регион</TableHead>
									<TableHead>Сумма</TableHead>
									<TableHead>Адрес</TableHead>
									<TableHead>Цель</TableHead>
									<TableHead>Срок жизни</TableHead>
									<TableHead>Статус</TableHead>
									<TableHead>Txn Hash</TableHead>
									<TableHead>Скриншот</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{requestItems.map(request => (
									<TableRow
										key={request.id}
										className='h-14.5'
									>
										<TableCell>
											{canManage ? (
												<Link
													href={`/admin/requests/${request.id}`}
													className='text-primary font-bold underline-offset-4 hover:underline'
												>
													{request.id}
												</Link>
											) : (
												request.id
											)}
										</TableCell>
										<TableCell>{request.createdAt}</TableCell>
										<TableCell>{request.creator}</TableCell>
										<TableCell>{request.regions}</TableCell>
										<TableCell className='text-primary font-bold'>
											{request.amount}
										</TableCell>
										<TableCell title={request.wallet}>
											{shortenValue(request.wallet)}
										</TableCell>
										<TableCell>{request.paymentGoal}</TableCell>
										<TableCell>{request.lifetime}</TableCell>
										<TableCell>
											<RequestStatusBadge
												status={request.status}
												onCancel={
													canManage && request.status === 'in_progress'
														? () => setRequestToCancel(request)
														: undefined
												}
											/>
										</TableCell>
										<TableCell title={request.txnHash}>
											{shortenValue(request.txnHash)}
										</TableCell>
										<TableCell>
											{request.hasScreenshot ? (
												<Button
													type='button'
													variant='outline'
													className='w-31.5'
												>
													SCRN
												</Button>
											) : (
												<span className='text-muted-foreground'>—</span>
											)}
										</TableCell>
									</TableRow>
								))}

								{requestItems.length === 0 && (
									<TableRow className='hover:bg-card'>
										<TableCell
											colSpan={11}
											className='text-muted-foreground h-160 text-center'
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

			<Dialog
				open={requestToCancel !== null}
				onOpenChange={handleDialogOpenChange}
			>
				<DialogContent className='max-w-160! gap-15 px-15 py-20'>
					<DialogHeader>
						<DialogTitle className='text-center'>
							Вы уверены что хотите отменить заявку?
						</DialogTitle>

						<DialogDescription className='sr-only'>
							Подтвердите отмену заявки
							{requestToCancel ? ` ${requestToCancel.id}` : ''}
						</DialogDescription>
					</DialogHeader>

					<Button
						type='button'
						size='lg'
						onClick={handleConfirmCancel}
					>
						Отменить заявку
					</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}
