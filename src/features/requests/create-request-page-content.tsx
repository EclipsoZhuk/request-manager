'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
	Check,
	FileImage,
	FileText,
	Info,
	Trash2,
	UploadCloud
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import {
	type CreateRequestLifetime,
	type CreateRequestPaymentGoal,
	type CreateRequestRegion
} from './mock'
import { cn } from '@/lib/utils'

type CreateRequestPageContentProps = {
	regions: CreateRequestRegion[]
	paymentGoals: CreateRequestPaymentGoal[]
	lifetimes: CreateRequestLifetime[]
}

const CUSTOM_LIFETIME_ID = 'custom'
const MAX_CUSTOM_LIFETIME_MINUTES = 7 * 24 * 60
const EXPIRING_SOON_THRESHOLD_MINUTES = 5

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_FILE_TYPES = [
	'image/svg+xml',
	'image/png',
	'image/jpeg',
	'image/gif',
	'application/pdf'
]

const ALLOWED_FILE_EXTENSION = /\.(svg|png|jpe?g|gif|pdf)$/i

const MAX_IMAGE_WIDTH = 800
const MAX_IMAGE_HEIGHT = 400

const regionPaymentSchema = z.object({
	regionId: z.string().min(1, 'Выберите регион'),
	amount: z
		.string()
		.trim()
		.min(1, 'Введите сумму')
		.refine(value => {
			const amount = Number(value)

			return Number.isFinite(amount) && amount > 0
		}, 'Введите корректную сумму')
})

const createRequestSchema = z
	.object({
		regions: z
			.array(regionPaymentSchema)
			.min(1, 'Добавьте хотя бы один регион'),
		wallet: z.string().trim().min(1, 'Введите адрес кошелька'),
		paymentGoalId: z.string().min(1, 'Выберите цель оплаты'),
		lifetimeId: z.string().min(1, 'Выберите срок жизни заявки'),
		customLifetimeMinutes: z.string().trim().optional(),
		attachment: z.custom<File | null>().nullable()
	})
	.superRefine((values, context) => {
		const selectedRegionIds = values.regions
			.map(region => region.regionId)
			.filter(Boolean)

		if (new Set(selectedRegionIds).size !== selectedRegionIds.length) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['regions'],
				message: 'Нельзя выбрать один регион несколько раз'
			})
		}

		if (values.lifetimeId === CUSTOM_LIFETIME_ID) {
			const minutes = Number(values.customLifetimeMinutes)

			if (
				!Number.isInteger(minutes) ||
				minutes < 1 ||
				minutes > MAX_CUSTOM_LIFETIME_MINUTES
			) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['customLifetimeMinutes'],
					message: `Введите целое число от 1 до ${MAX_CUSTOM_LIFETIME_MINUTES}`
				})
			}
		}
	})

type CreateRequestFormValues = z.infer<typeof createRequestSchema>

function getDefaultValues(): CreateRequestFormValues {
	return {
		regions: [
			{
				regionId: '',
				amount: ''
			}
		],
		wallet: '',
		paymentGoalId: '',
		lifetimeId: '',
		customLifetimeMinutes: '',
		attachment: null
	}
}

function formatTotalAmount(value: number) {
	return value.toFixed(5)
}

function formatRegionAmount(value: number) {
	return value.toFixed(2)
}

function formatLimit(value: number) {
	return String(value)
}

type LimitStatus = 'safe' | 'warning' | 'exceeded'

type LifetimeStatus = 'idle' | 'active' | 'warning' | 'expired' | 'unlimited'

function getLimitStatus(amountValue: string, limit: number): LimitStatus {
	const amount = Number(amountValue)

	if (!Number.isFinite(amount) || amount <= 0) {
		return 'safe'
	}

	if (amount > limit) {
		return 'exceeded'
	}

	if (amount >= limit * 0.8) {
		return 'warning'
	}

	return 'safe'
}

function getLifetimeLabel(
	lifetime: CreateRequestLifetime | undefined,
	customMinutes?: string
) {
	if (!lifetime) {
		return '—'
	}

	if (lifetime.type === 'custom') {
		const minutes = Number(customMinutes)

		return Number.isInteger(minutes) && minutes > 0 ? `${minutes} минут` : '—'
	}

	return lifetime.label
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

function formatFileSize(size: number) {
	if (size < 1024) {
		return `${size} Б`
	}

	if (size < 1024 * 1024) {
		return `${Math.round(size / 1024)} КБ`
	}

	return `${(size / 1024 / 1024).toFixed(1)} МБ`
}

function readImageDimensions(file: File) {
	return new Promise<{
		width: number
		height: number
	}>((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file)
		const image = new Image()

		image.onload = () => {
			resolve({
				width: image.naturalWidth,
				height: image.naturalHeight
			})

			URL.revokeObjectURL(objectUrl)
		}

		image.onerror = () => {
			URL.revokeObjectURL(objectUrl)
			reject(new Error('Не удалось прочитать изображение'))
		}

		image.src = objectUrl
	})
}

export function CreateRequestPageContent({
	regions,
	paymentGoals,
	lifetimes
}: CreateRequestPageContentProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [fileError, setFileError] = useState<string | null>(null)
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

	const [pendingRequest, setPendingRequest] =
		useState<CreateRequestFormValues | null>(null)

	const [createdRequestNumber, setCreatedRequestNumber] = useState('')

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset
	} = useForm<CreateRequestFormValues>({
		resolver: zodResolver(createRequestSchema),
		defaultValues: getDefaultValues()
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'regions'
	})

	const selectedRegions = useWatch({
		control,
		name: 'regions'
	})

	const selectedLifetimeId = useWatch({
		control,
		name: 'lifetimeId'
	})

	const attachment = useWatch({
		control,
		name: 'attachment'
	})

	const customLifetimeMinutes = useWatch({
		control,
		name: 'customLifetimeMinutes'
	})

	const totalAmount = useMemo(() => {
		return selectedRegions.reduce((total, item) => {
			const amount = Number(item.amount)

			return total + (Number.isFinite(amount) ? amount : 0)
		}, 0)
	}, [selectedRegions])

	const selectedLifetime = lifetimes.find(
		lifetime => lifetime.id === selectedLifetimeId
	)

	const resolvedLifetimeMinutes = useMemo(() => {
		if (!selectedLifetime) {
			return null
		}

		if (selectedLifetime.type === 'unlimited') {
			return null
		}

		if (selectedLifetime.type === 'fixed') {
			return selectedLifetime.minutes
		}

		const minutes = Number(customLifetimeMinutes)

		if (!Number.isInteger(minutes) || minutes <= 0) {
			return null
		}

		return minutes
	}, [customLifetimeMinutes, selectedLifetime])

	const [lifetimeStartedAt, setLifetimeStartedAt] = useState<number | null>(
		null
	)
	const [now, setNow] = useState(() => Date.now())

	useEffect(() => {
		if (
			!selectedLifetime ||
			selectedLifetime.type === 'unlimited' ||
			!resolvedLifetimeMinutes
		) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLifetimeStartedAt(null)
			return
		}

		setLifetimeStartedAt(Date.now())
		setNow(Date.now())
	}, [selectedLifetimeId, resolvedLifetimeMinutes, selectedLifetime])

	const expiresAtTimestamp = useMemo(() => {
		if (!lifetimeStartedAt || !resolvedLifetimeMinutes) {
			return null
		}

		return lifetimeStartedAt + resolvedLifetimeMinutes * 60_000
	}, [lifetimeStartedAt, resolvedLifetimeMinutes])

	useEffect(() => {
		if (!expiresAtTimestamp) {
			return
		}

		const intervalId = window.setInterval(() => {
			setNow(Date.now())
		}, 1000)

		return () => {
			window.clearInterval(intervalId)
		}
	}, [expiresAtTimestamp])

	const remainingMilliseconds =
		expiresAtTimestamp === null ? null : Math.max(expiresAtTimestamp - now, 0)

	const remainingMinutes =
		remainingMilliseconds === null
			? null
			: Math.ceil(remainingMilliseconds / 60_000)

	const lifetimeStatus: LifetimeStatus = useMemo(() => {
		if (!selectedLifetime) {
			return 'idle'
		}

		if (selectedLifetime.type === 'unlimited') {
			return 'unlimited'
		}

		if (remainingMilliseconds === null) {
			return 'idle'
		}

		if (remainingMilliseconds <= 0) {
			return 'expired'
		}

		if (remainingMilliseconds <= EXPIRING_SOON_THRESHOLD_MINUTES * 60_000) {
			return 'warning'
		}

		return 'active'
	}, [remainingMilliseconds, selectedLifetime])

	const expiresAt = useMemo(() => {
		if (!expiresAtTimestamp) {
			return null
		}

		return new Date(expiresAtTimestamp)
	}, [expiresAtTimestamp])

	function getRegion(regionId: string) {
		return regions.find(region => region.id === regionId)
	}

	function isRegionAlreadySelected(regionId: string, currentIndex: number) {
		return selectedRegions.some(
			(item, index) => index !== currentIndex && item.regionId === regionId
		)
	}

	function handleAddRegion() {
		append({
			regionId: '',
			amount: ''
		})
	}

	function handleRemoveRegion(index: number) {
		remove(index)
	}

	async function handlePasteWallet() {
		try {
			const clipboardText = await navigator.clipboard.readText()

			setValue('wallet', clipboardText, {
				shouldDirty: true,
				shouldValidate: true
			})
		} catch {
			// Clipboard API может быть недоступен вне HTTPS.
		}
	}

	function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]

		if (file) {
			void handleAttachmentFile(file)
		}

		event.target.value = ''
	}

	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault()

		const file = event.dataTransfer.files?.[0]

		if (file) {
			void handleAttachmentFile(file)
		}
	}

	async function handleAttachmentFile(file: File) {
		setFileError(null)

		const hasAllowedType =
			ALLOWED_FILE_TYPES.includes(file.type) ||
			ALLOWED_FILE_EXTENSION.test(file.name)

		if (!hasAllowedType) {
			setFileError('Поддерживаются SVG, PNG, JPG, GIF и PDF')
			return
		}

		if (file.size > MAX_FILE_SIZE) {
			setFileError('Максимальный размер файла — 10 МБ')
			return
		}

		const isImage =
			file.type.startsWith('image/') ||
			/\.(svg|png|jpe?g|gif)$/i.test(file.name)

		if (isImage) {
			try {
				const dimensions = await readImageDimensions(file)

				if (
					dimensions.width > MAX_IMAGE_WIDTH ||
					dimensions.height > MAX_IMAGE_HEIGHT
				) {
					setFileError(
						`Максимальный размер изображения — ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT}px`
					)
					return
				}
			} catch {
				setFileError('Не удалось прочитать выбранное изображение')
				return
			}
		}

		setValue('attachment', file, {
			shouldDirty: true,
			shouldValidate: true
		})
	}

	function handleRemoveAttachment() {
		setValue('attachment', null, {
			shouldDirty: true
		})

		setFileError(null)

		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	function handleOpenConfirmation(values: CreateRequestFormValues) {
		if (lifetimeStatus === 'expired') {
			return
		}

		setPendingRequest(values)
		setIsConfirmDialogOpen(true)
	}

	function handleConfirmCreateRequest() {
		if (!pendingRequest || lifetimeStatus === 'expired') {
			return
		}

		const requestNumber = Math.floor(1000000 + Math.random() * 9000000)

		setCreatedRequestNumber(`#${requestNumber}`)
		setIsConfirmDialogOpen(false)
		setIsSuccessDialogOpen(true)
	}

	function handleResetForm() {
		reset(getDefaultValues())

		setPendingRequest(null)
		setFileError(null)

		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	function handleCreateNewRequest() {
		setIsSuccessDialogOpen(false)
		handleResetForm()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(handleOpenConfirmation)}
				className='grid min-h-0 flex-1 items-start gap-5 xl:grid-cols-2'
			>
				<div className='bg-card min-h-164 rounded-2xl border p-10'>
					<div className='flex flex-col gap-10'>
						{fields.map((field, index) => {
							const selectedRegionId = selectedRegions[index]?.regionId ?? ''
							const selectedRegion = getRegion(selectedRegionId)

							const limitStatus = selectedRegion
								? getLimitStatus(
										selectedRegions[index]?.amount ?? '',
										selectedRegion.limit
									)
								: null

							return (
								<div
									key={field.id}
									className={cn(
										'flex flex-col gap-10',
										index < fields.length - 1 && 'border-b border-dashed pb-10'
									)}
								>
									<div className='space-y-2'>
										<div className='flex items-center gap-3'>
											<Controller
												control={control}
												name={`regions.${index}.regionId`}
												render={({ field }) => (
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className='w-full'>
															<SelectValue placeholder='Регион' />
														</SelectTrigger>

														<SelectContent
															position='popper'
															align='start'
															sideOffset={8}
														>
															{regions.map(region => (
																<SelectItem
																	key={region.id}
																	value={region.id}
																	disabled={isRegionAlreadySelected(
																		region.id,
																		index
																	)}
																	className='focus:border-border text-muted-foreground data-[state=checked]:border-border h-12 rounded-lg border border-transparent px-3 text-sm font-bold focus:bg-white data-[state=checked]:bg-white'
																>
																	{region.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}
											/>

											{fields.length > 1 && (
												<Button
													type='button'
													variant='destructive'
													size='icon-lg'
													className='bg-transparent'
													onClick={() => handleRemoveRegion(index)}
												>
													<Trash2 className='size-5' />
												</Button>
											)}
										</div>

										{errors.regions?.[index]?.regionId && (
											<p className='text-destructive'>
												{errors.regions[index]?.regionId?.message}
											</p>
										)}
									</div>

									<div className='space-y-5'>
										<div className='space-y-2'>
											<div className='relative'>
												<span className='text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold'>
													USDT
												</span>

												<Input
													type='number'
													inputMode='decimal'
													step='any'
													placeholder='0.00000'
													className='pl-18.5'
													{...register(`regions.${index}.amount`)}
												/>
											</div>

											{errors.regions?.[index]?.amount && (
												<p className='text-destructive'>
													{errors.regions[index]?.amount?.message}
												</p>
											)}
										</div>

										<p className='text-lg'>
											Лимит:{' '}
											<span className='text-chart-2'>
												{selectedRegion
													? `${formatLimit(selectedRegion.limit)} USDT`
													: '—'}
											</span>
										</p>

										{limitStatus && <LimitState status={limitStatus} />}
									</div>
								</div>
							)
						})}

						{typeof errors.regions?.message === 'string' && (
							<p className='text-destructive'>{errors.regions.message}</p>
						)}

						<Button
							type='button'
							variant='outline'
							onClick={handleAddRegion}
							disabled={fields.length >= regions.length}
							className='w-fit'
						>
							+ Добавить регион
						</Button>
					</div>
				</div>

				<div className='bg-card flex flex-col rounded-2xl border p-10'>
					<div className='bg-primary/20 text-primary flex items-center gap-3 rounded-lg p-3 text-base font-bold'>
						<span>Общая сумма по всем регионам</span>
						<span className='text-2xl'>{formatTotalAmount(totalAmount)}</span>
					</div>

					<div className='mt-10 flex flex-col gap-10'>
						<div className='space-y-2'>
							<div className='flex'>
								<Input
									placeholder='Кошелек'
									className='rounded-r-none'
									{...register('wallet')}
								/>

								<Button
									type='button'
									variant='outline'
									onClick={handlePasteWallet}
									className='text-foreground border-border h-14 rounded-l-none border-l-0 px-4'
								>
									Вставить
								</Button>
							</div>

							{errors.wallet && (
								<p className='text-destructive'>{errors.wallet.message}</p>
							)}
						</div>

						<div>
							<Controller
								control={control}
								name='paymentGoalId'
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Цель оплаты' />
										</SelectTrigger>

										<SelectContent
											position='popper'
											align='start'
											sideOffset={8}
										>
											{paymentGoals.map(goal => (
												<SelectItem
													key={goal.id}
													value={goal.id}
													className='focus:border-border text-muted-foreground data-[state=checked]:border-border h-12 rounded-lg border border-transparent px-3 text-sm font-bold focus:bg-white data-[state=checked]:bg-white'
												>
													{goal.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							{errors.paymentGoalId && (
								<p className='text-destructive mt-2'>
									{errors.paymentGoalId.message}
								</p>
							)}
						</div>

						<div>
							<Controller
								control={control}
								name='lifetimeId'
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={value => {
											field.onChange(value)

											if (value !== CUSTOM_LIFETIME_ID) {
												setValue('customLifetimeMinutes', '', {
													shouldDirty: true,
													shouldValidate: true
												})
											}
										}}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Срок жизни заявки' />
										</SelectTrigger>

										<SelectContent
											position='popper'
											align='start'
											sideOffset={8}
										>
											{lifetimes.map(lifetime => (
												<SelectItem
													key={lifetime.id}
													value={lifetime.id}
													className='focus:border-border text-muted-foreground data-[state=checked]:border-border h-12 rounded-lg border border-transparent px-3 text-sm font-bold focus:bg-white data-[state=checked]:bg-white'
												>
													{lifetime.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							{errors.lifetimeId && (
								<p className='text-destructive mt-2'>
									{errors.lifetimeId.message}
								</p>
							)}
						</div>

						{selectedLifetime?.type === 'custom' && (
							<div className='space-y-2'>
								<Input
									type='number'
									inputMode='numeric'
									min={1}
									max={MAX_CUSTOM_LIFETIME_MINUTES}
									step={1}
									placeholder='Введите срок жизни в минутах'
									{...register('customLifetimeMinutes')}
								/>

								{errors.customLifetimeMinutes && (
									<p className='text-destructive'>
										{errors.customLifetimeMinutes.message}
									</p>
								)}
							</div>
						)}

						<ImageUpload
							file={attachment}
							error={fileError}
							fileInputRef={fileInputRef}
							onInputChange={handleFileInputChange}
							onDrop={handleDrop}
							onRemove={handleRemoveAttachment}
						/>

						<LifetimeState
							status={lifetimeStatus}
							lifetime={selectedLifetime}
							expiresAt={expiresAt}
							remainingMinutes={remainingMinutes}
						/>
					</div>

					<div className='mt-auto grid grid-cols-2 gap-4 pt-8'>
						<Button
							type='button'
							variant='outline'
							size='lg'
							onClick={handleResetForm}
						>
							Отменить заявку
						</Button>

						<Button
							type='submit'
							disabled={lifetimeStatus === 'expired'}
							size='lg'
						>
							Создать заявку
						</Button>
					</div>
				</div>
			</form>

			<RequestConfirmationDialog
				open={isConfirmDialogOpen}
				onOpenChange={setIsConfirmDialogOpen}
				request={pendingRequest}
				regions={regions}
				paymentGoals={paymentGoals}
				lifetimes={lifetimes}
				totalAmount={totalAmount}
				expiresAt={expiresAt}
				isExpired={lifetimeStatus === 'expired'}
				onConfirm={handleConfirmCreateRequest}
			/>

			<RequestSuccessDialog
				open={isSuccessDialogOpen}
				onOpenChange={setIsSuccessDialogOpen}
				requestNumber={createdRequestNumber}
				lifetime={selectedLifetime}
				expiresAt={expiresAt}
				onCreateNew={handleCreateNewRequest}
			/>
		</>
	)
}

type LifetimeStateProps = {
	status: LifetimeStatus
	lifetime?: CreateRequestLifetime
	expiresAt: Date | null
	remainingMinutes: number | null
}

function LifetimeState({
	status,
	lifetime,
	expiresAt,
	remainingMinutes
}: LifetimeStateProps) {
	if (status === 'expired') {
		return (
			<div className='bg-destructive/20 text-destructive flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs leading-none font-bold'>
				<Info className='size-4 shrink-0' />
				Заявка уже перестала быть актуальной
			</div>
		)
	}

	return (
		<div className='space-y-5 text-lg leading-none font-semibold'>
			<div className='text-chart-2 flex items-center gap-2.5 rounded-lg bg-[#79FF4833] px-3 py-2 text-xs leading-none font-bold'>
				<Info className='size-4 shrink-0' />
				После окончания указанного времени неоплаченная заявка будет
				автоматически отменена.
			</div>

			{status === 'active' && lifetime && expiresAt && (
				<p>
					Заявка будет активна {lifetime.label.toLowerCase()}, до{' '}
					{formatDateTime(expiresAt)}.
				</p>
			)}

			{status === 'warning' && (
				<p className='text-chart-3'>
					До окончания срока жизни заявки осталось меньше{' '}
					{EXPIRING_SOON_THRESHOLD_MINUTES} минут
					{remainingMinutes !== null && ` — примерно ${remainingMinutes} мин.`}
				</p>
			)}

			{status === 'unlimited' && (
				<p className=''>Заявка будет активна бессрочно.</p>
			)}

			{status === 'idle' && (
				<p className='text-muted-foreground'>Выберите срок жизни заявки.</p>
			)}
		</div>
	)
}

function LimitState({ status }: { status: LimitStatus }) {
	const config = {
		safe: {
			text: 'Оплата может превысить лимит',
			className: 'bg-[#79FF4833] text-chart-2'
		},
		warning: {
			text: 'Оплата может превысить лимит',
			className: 'bg-chart-3/20 text-chart-3'
		},
		exceeded: {
			text: 'Превышен лимит',
			className: 'bg-destructive/20 text-destructive'
		}
	} satisfies Record<
		LimitStatus,
		{
			text: string
			className: string
		}
	>

	const current = config[status]

	return (
		<div
			className={cn(
				'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs leading-none font-bold',
				current.className
			)}
		>
			<Info className='size-4 shrink-0' />
			{current.text}
		</div>
	)
}

type ImageUploadProps = {
	file: File | null
	error: string | null
	fileInputRef: React.RefObject<HTMLInputElement | null>
	onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void
	onRemove: () => void
}

function ImageUpload({
	file,
	error,
	fileInputRef,
	onInputChange,
	onDrop,
	onRemove
}: ImageUploadProps) {
	return (
		<div className='flex flex-col gap-5'>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/svg+xml,image/png,image/jpeg,image/gif,application/pdf,.svg,.png,.jpg,.jpeg,.gif,.pdf'
				onChange={onInputChange}
				className='hidden'
			/>

			<div className='space-y-2'>
				<div
					role='button'
					tabIndex={0}
					onClick={() => fileInputRef.current?.click()}
					onKeyDown={event => {
						if (event.key === 'Enter' || event.key === ' ') {
							fileInputRef.current?.click()
						}
					}}
					onDragOver={event => event.preventDefault()}
					onDrop={onDrop}
					className='hover:bg-muted/30 text-muted-foreground flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border px-6 py-4 text-center font-bold transition-colors'
				>
					<div className='mb-3 flex size-10 items-center justify-center rounded-md border'>
						<UploadCloud className='size-5' />
					</div>

					<p>
						<span className='text-primary'>Click to upload</span> or drag and
						drop
					</p>
					<p className='mt-1'>SVG, PNG, JPG or GIF (max. 800x400px)</p>
				</div>

				{error && <p className='text-destructive'>{error}</p>}
			</div>

			{file && (
				<div className='flex items-center gap-3 rounded-xl border p-4'>
					<div className='bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-md'>
						{file.type === 'application/pdf' ? (
							<FileText className='size-5' />
						) : (
							<FileImage className='size-5' />
						)}
					</div>

					<div className='min-w-0 flex-1 space-y-1'>
						<p className='truncate font-medium'>{file.name}</p>
						<p>{formatFileSize(file.size)} — 100% uploaded</p>
					</div>

					<div className='bg-primary flex size-5 shrink-0 items-center justify-center rounded'>
						<Check className='text-primary-foreground size-3.5' />
					</div>

					<Button
						type='button'
						variant='destructive'
						size='icon-lg'
						onClick={event => {
							event.stopPropagation()
							onRemove()
						}}
						className='bg-transparent'
					>
						<Trash2 className='size-5' />
					</Button>
				</div>
			)}
		</div>
	)
}

type RequestConfirmationDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	request: CreateRequestFormValues | null
	regions: CreateRequestRegion[]
	paymentGoals: CreateRequestPaymentGoal[]
	lifetimes: CreateRequestLifetime[]
	totalAmount: number
	expiresAt: Date | null
	isExpired: boolean
	onConfirm: () => void
}

function RequestConfirmationDialog({
	open,
	onOpenChange,
	request,
	regions,
	paymentGoals,
	lifetimes,
	totalAmount,
	expiresAt,
	onConfirm,
	isExpired
}: RequestConfirmationDialogProps) {
	if (!request) {
		return null
	}

	const paymentGoal = paymentGoals.find(
		goal => goal.id === request.paymentGoalId
	)

	const lifetime = lifetimes.find(item => item.id === request.lifetimeId)

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-h-[90vh] w-[calc(100%-32px)] max-w-312 gap-10 overflow-hidden rounded-3xl border-0 p-10 xl:max-w-364'>
				<DialogHeader className='sr-only'>
					<DialogTitle>Подтверждение создания заявки</DialogTitle>
					<DialogDescription>
						Проверьте данные перед созданием заявки
					</DialogDescription>
				</DialogHeader>

				<div className='grid min-h-0 gap-5 xl:grid-cols-2'>
					<div className='max-h-170 overflow-y-auto rounded-3xl border p-10'>
						<div className='flex flex-col gap-10'>
							{request.regions.map((regionPayment, index) => {
								const region = regions.find(
									item => item.id === regionPayment.regionId
								)

								return (
									<div
										key={`${regionPayment.regionId}-${index}`}
										className={cn(
											'flex flex-col gap-5',
											index < request.regions.length - 1 &&
												'border-b border-dashed pb-10'
										)}
									>
										<PreviewField>{region?.label ?? '—'}</PreviewField>

										<PreviewField>
											<span className='text-primary mr-2.5'>USDT</span>
											{formatRegionAmount(Number(regionPayment.amount))}
										</PreviewField>

										<p className='text-lg font-semibold'>
											Лимит:{' '}
											<span className='text-chart-2'>
												{region ? `${formatLimit(region.limit)} USDT` : '—'}
											</span>
										</p>
									</div>
								)
							})}
						</div>
					</div>

					<div className='flex max-h-170 flex-col overflow-y-auto rounded-3xl border p-10'>
						<div className='bg-primary/20 text-primary flex items-center gap-3 rounded-lg p-3 text-base font-bold'>
							<span>Общая сумма по всем регионам</span>
							<span className='text-2xl'>{formatTotalAmount(totalAmount)}</span>
						</div>

						<div className='mt-10 flex flex-col gap-10'>
							<PreviewField>{request.wallet}</PreviewField>
							<PreviewField>{paymentGoal?.label ?? '—'}</PreviewField>
							<PreviewField>
								{getLifetimeLabel(lifetime, request.customLifetimeMinutes)}
							</PreviewField>

							{request.attachment && (
								<div className='rounded-lg border p-4'>
									<div className='flex items-center gap-3'>
										{request.attachment.type === 'application/pdf' ? (
											<FileText className='text-primary size-7' />
										) : (
											<FileImage className='text-primary size-7' />
										)}

										<div className='min-w-0'>
											<p className='truncate font-semibold'>
												{request.attachment.name}
											</p>

											<p className='text-muted-foreground text-sm'>
												{formatFileSize(request.attachment.size)}
											</p>
										</div>
									</div>
								</div>
							)}

							{lifetime?.type === 'unlimited' && (
								<p className='text-lg leading-none font-semibold'>
									Заявка будет активна бессрочно.
								</p>
							)}

							{lifetime && lifetime.type !== 'unlimited' && expiresAt && (
								<p className='text-lg leading-none font-semibold'>
									Заявка будет активна {lifetime.label.toLowerCase()}, до{' '}
									{formatDateTime(expiresAt)}.
								</p>
							)}
						</div>
					</div>
				</div>

				<div className='ml-auto grid w-full grid-cols-4 gap-5'>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
						className='col-start-3'
						size='lg'
					>
						Отменить заявку
					</Button>

					<Button
						type='button'
						disabled={isExpired}
						onClick={onConfirm}
						className='col-start-4'
						size='lg'
					>
						Создать заявку
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function PreviewField({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-14 items-center rounded-lg border px-4 text-lg font-semibold'>
			{children}
		</div>
	)
}

type RequestSuccessDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	requestNumber: string
	lifetime?: CreateRequestLifetime
	expiresAt: Date | null
	onCreateNew: () => void
}

function RequestSuccessDialog({
	open,
	onOpenChange,
	requestNumber,
	lifetime,
	expiresAt,
	onCreateNew
}: RequestSuccessDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='w-[calc(100%-32px)] max-w-158 gap-0 rounded-3xl border-0 px-15 py-20 sm:max-w-158'>
				<DialogHeader>
					<DialogTitle className='text-center text-[32px] leading-none font-bold'>
						Заявка успешно создана
					</DialogTitle>

					<DialogDescription className='sr-only'>
						Информация о созданной заявке
					</DialogDescription>
				</DialogHeader>

				<div className='mt-10 flex flex-col items-center gap-10 text-center text-lg font-semibold'>
					<p className='text-lg'>
						Номер заявки: <span className='text-primary'>{requestNumber}</span>
					</p>

					<span className='bg-chart-3/20 text-chart-3 rounded-xl px-4 py-2 text-base font-bold'>
						In Progress
					</span>

					{lifetime?.type === 'unlimited' && (
						<p>Заявка будет активна бессрочно.</p>
					)}

					{lifetime && lifetime.type !== 'unlimited' && expiresAt && (
						<p>
							Заявка будет активна {lifetime.label.toLowerCase()}, до{' '}
							{formatDateTime(expiresAt)}.
						</p>
					)}
				</div>
				<Button
					type='button'
					onClick={onCreateNew}
					className='mt-15 w-full'
					size='lg'
				>
					Создать новую заявку
				</Button>
			</DialogContent>
		</Dialog>
	)
}
