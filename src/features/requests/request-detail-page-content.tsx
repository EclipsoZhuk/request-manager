'use client'

import { ChevronDown, FileText, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

type RequestStatus = 'cancelled' | 'in_progress' | 'paid'

type RequestDetailRegion = {
	id: string
	label: string
	amount: number
	limit: number
}

type RequestDetail = {
	id: string
	status: RequestStatus
	currency: string
	totalAmount: number
	wallet: string
	platform: string
	reason: string
	regions: RequestDetailRegion[]
	attachment: { name: string; sizeLabel: string } | null
}

const STATIC_REQUEST: RequestDetail = {
	id: '0002',
	status: 'in_progress',
	currency: 'USDT',
	totalAmount: 6000,
	wallet: 'G3ksJf4ash12Ta',
	platform: 'User 012413',
	reason: 'Lorem ipsum dolor sit amet...',
	regions: [
		{ id: 'region-21', label: 'Регион 21', amount: 1500, limit: 2000 },
		{ id: 'region-53', label: 'Регион 53', amount: 3000, limit: 4000 },
		{ id: 'region-5411', label: 'Регион 5411', amount: 1500, limit: 8000 }
	],
	attachment: {
		name: 'Tech design requirements.pdf',
		sizeLabel: '200 KB – 100% uploaded'
	}
}

const ACTIVE_DURATION_MS = 30 * 60 * 1000

function formatAmount(value: number, fractionDigits: number) {
	return value.toFixed(fractionDigits)
}

function formatDateTime(date: Date) {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)
}

function formatCountdown(milliseconds: number) {
	const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0)

	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	return [hours, minutes, seconds]
		.map(part => String(part).padStart(2, '0'))
		.join(':')
}

export function RequestDetailPageContent() {
	const request = STATIC_REQUEST

	const [status, setStatus] = useState<RequestStatus>(request.status)
	const [expiresAtTimestamp, setExpiresAtTimestamp] = useState<number | null>(
		null
	)
	const [now, setNow] = useState(() => Date.now())
	const [copiedField, setCopiedField] = useState<string | null>(null)
	const [isPaidDialogOpen, setIsPaidDialogOpen] = useState(false)

	const isActive = status === 'in_progress'

	useEffect(() => {
		if (!isActive) {
			return
		}

		const intervalId = window.setInterval(() => {
			setNow(Date.now())
			setExpiresAtTimestamp(
				current => current ?? Date.now() + ACTIVE_DURATION_MS
			)
		}, 1000)

		return () => {
			window.clearInterval(intervalId)
		}
	}, [isActive])

	const remainingMilliseconds =
		expiresAtTimestamp === null ? ACTIVE_DURATION_MS : expiresAtTimestamp - now
	const isExpired = remainingMilliseconds <= 0

	async function handleCopy(field: string, value: string) {
		try {
			await navigator.clipboard.writeText(value)

			setCopiedField(field)

			window.setTimeout(() => {
				setCopiedField(current => (current === field ? null : current))
			}, 1500)
		} catch {
			// Clipboard API может быть недоступен вне HTTPS.
		}
	}

	function handleCancel() {
		setStatus('cancelled')
	}

	return (
		<div className='grid min-h-0 items-start gap-5 xl:grid-cols-2'>
			<div className='bg-card min-h-164 rounded-2xl border p-10'>
				<div className='bg-primary/20 text-primary flex items-center gap-3 rounded-lg p-3 text-base font-bold'>
					<span>Общая сумма по всем регионам</span>
					<span className='text-2xl'>
						{formatAmount(request.totalAmount, 5)}
					</span>
				</div>

				<div className='mt-10 flex flex-col gap-10'>
					{request.regions.map((region, index) => (
						<div
							key={region.id}
							className={cn(
								'flex flex-col gap-5',
								index < request.regions.length - 1 &&
									'border-b border-dashed pb-10'
							)}
						>
							<div className='flex items-center gap-3'>
								<div className='flex h-14 flex-1 items-center justify-between rounded-lg border px-4 text-lg font-semibold'>
									<span>{region.label}</span>
									<ChevronDown className='text-muted-foreground size-5' />
								</div>

								{index > 0 && (
									<Button
										type='button'
										variant='destructive'
										size='icon-lg'
										className='bg-transparent'
										disabled
									>
										<Trash2 className='size-5' />
									</Button>
								)}
							</div>

							<div className='relative'>
								<span className='text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold'>
									{request.currency}
								</span>

								<Input
									readOnly
									value={formatAmount(region.amount, 2)}
									className='pl-18.5 font-semibold'
								/>
							</div>

							<p className='text-lg'>
								Лимит: <span className='text-chart-2'>{region.limit} USDT</span>
							</p>
						</div>
					))}

					<Button
						type='button'
						variant='outline'
						className='w-fit'
						disabled
					>
						+ Добавить регион
					</Button>
				</div>
			</div>

			<div className='bg-card flex min-h-164 flex-col rounded-2xl border p-10'>
				<div className='flex flex-col gap-10'>
					<div className='flex'>
						<Input
							readOnly
							value={request.wallet}
							className='rounded-r-none font-semibold'
						/>

						<Button
							type='button'
							variant='outline'
							onClick={() => handleCopy('wallet', request.wallet)}
							className='text-foreground border-border h-14 rounded-l-none border-l-0 px-4'
						>
							{copiedField === 'wallet' ? 'Скопировано' : 'Скопировать'}
						</Button>
					</div>

					<div className='flex'>
						<div className='relative w-full'>
							<span className='text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold'>
								{request.currency}
							</span>

							<Input
								readOnly
								value={formatAmount(request.totalAmount, 5)}
								className='rounded-r-none pl-18.5 font-semibold'
							/>
						</div>

						<Button
							type='button'
							variant='outline'
							onClick={() =>
								handleCopy('total', formatAmount(request.totalAmount, 5))
							}
							className='text-foreground border-border h-14 rounded-l-none border-l-0 px-4'
						>
							{copiedField === 'total' ? 'Скопировано' : 'Скопировать'}
						</Button>
					</div>

					<div className='flex h-14 items-center rounded-lg border px-4 text-lg font-semibold'>
						{request.platform}
					</div>

					<div className='flex h-14 items-center justify-between rounded-lg border px-4 text-lg font-semibold'>
						<span className='truncate'>{request.reason}</span>
						<ChevronDown className='text-muted-foreground size-5 shrink-0' />
					</div>

					{request.attachment && (
						<div className='flex items-center gap-3 rounded-xl border p-4'>
							<div className='bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-md'>
								<FileText className='size-5' />
							</div>

							<div className='min-w-0 flex-1 space-y-1'>
								<p className='truncate font-medium'>
									{request.attachment.name}
								</p>
								<p>{request.attachment.sizeLabel}</p>
							</div>
						</div>
					)}
				</div>

				<div className='mt-auto flex flex-col gap-5 pt-10'>
					<RequestStateBanner
						status={status}
						isExpired={isExpired}
						remainingLabel={formatCountdown(remainingMilliseconds)}
						expiresAtLabel={formatDateTime(new Date(expiresAtTimestamp ?? now))}
					/>

					{isActive && !isExpired && (
						<div className='grid grid-cols-2 gap-4'>
							<Button
								type='button'
								variant='outline'
								size='lg'
								onClick={handleCancel}
							>
								Отменить заявку
							</Button>

							<Button
								type='button'
								size='lg'
								onClick={() => setIsPaidDialogOpen(true)}
							>
								Оплачено!
							</Button>
						</div>
					)}
				</div>
			</div>

			<Dialog
				open={isPaidDialogOpen}
				onOpenChange={setIsPaidDialogOpen}
			>
				<DialogContent className='max-w-157! gap-15 p-15'>
					<DialogHeader className='sr-only'>
						<DialogTitle>Вставьте Txn Hash транзакции</DialogTitle>
						<DialogDescription>
							Укажите хэш транзакции для подтверждения оплаты заявки{' '}
							{request.id}
						</DialogDescription>
					</DialogHeader>

					<div className='flex flex-col gap-4'>
						<Label htmlFor='txn-hash'>Вставьте Txn Hash транзакции</Label>
						<Textarea
							id='txn-hash'
							placeholder='Txn Hash транзакции'
							autoFocus
						/>
					</div>

					<DialogFooter>
						<Button
							type='button'
							size='lg'
							className='w-full'
							onClick={() => {
								setStatus('paid')
								setIsPaidDialogOpen(false)
							}}
						>
							Подтвердить
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

type RequestStateBannerProps = {
	status: RequestStatus
	isExpired: boolean
	remainingLabel: string
	expiresAtLabel: string
}

function RequestStateBanner({
	status,
	isExpired,
	remainingLabel,
	expiresAtLabel
}: RequestStateBannerProps) {
	if (status === 'cancelled') {
		return (
			<div className='bg-destructive/20 text-destructive border-destructive rounded-full border px-4 py-3 text-center text-base font-bold'>
				Заявка отменена
			</div>
		)
	}

	if (status === 'paid') {
		return (
			<div className='border-chart-2 flex items-center justify-center gap-1 rounded-full border bg-[#79FF4833] px-4 py-3 text-base font-bold'>
				Заявка оплачена
			</div>
		)
	}

	if (isExpired) {
		return (
			<div className='bg-destructive/20 text-destructive border-destructive rounded-full border px-4 py-3 text-center text-base font-bold'>
				Заявка уже перестала быть актуальной
			</div>
		)
	}

	return (
		<div className='border-chart-2 flex items-center justify-center gap-1 rounded-full border bg-[#79FF4833] px-4 py-3 text-base font-bold'>
			ЗАЯВКА БУДЕТ АКТИВНА{' '}
			<span className='text-chart-2 text-2xl'>{remainingLabel}</span>, ДО{' '}
			{expiresAtLabel}.
		</div>
	)
}
