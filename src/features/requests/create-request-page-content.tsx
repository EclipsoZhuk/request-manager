'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, FileImage, Info, Trash2, UploadCloud } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
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

		attachment: z.custom<File | null>().nullable()
	})
	.superRefine((values, context) => {
		const selectedRegionIds = values.regions
			.map(region => region.regionId)
			.filter(Boolean)

		const uniqueRegionIds = new Set(selectedRegionIds)

		if (uniqueRegionIds.size !== selectedRegionIds.length) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['regions'],
				message: 'Нельзя выбрать один регион несколько раз'
			})
		}
	})

type CreateRequestFormValues = z.infer<typeof createRequestSchema>

const ALLOWED_IMAGE_TYPES = [
	'image/svg+xml',
	'image/png',
	'image/jpeg',
	'image/gif'
]

const ALLOWED_IMAGE_EXTENSION = /\.(svg|png|jpe?g|gif)$/i

const MAX_IMAGE_WIDTH = 800
const MAX_IMAGE_HEIGHT = 400

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
		attachment: null
	}
}

function formatAmount(value: number) {
	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 5
	}).format(value)
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

	const totalAmount = useMemo(() => {
		return selectedRegions.reduce((total, item) => {
			const amount = Number(item.amount)

			return total + (Number.isFinite(amount) ? amount : 0)
		}, 0)
	}, [selectedRegions])

	const selectedLifetime = lifetimes.find(
		lifetime => lifetime.id === selectedLifetimeId
	)

	const expiresAt = useMemo(() => {
		if (!selectedLifetime) {
			return null
		}

		const date = new Date()

		date.setMinutes(date.getMinutes() + selectedLifetime.minutes)

		return date
	}, [selectedLifetime])

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

	async function handleImageFile(file: File) {
		setFileError(null)

		const hasAllowedType =
			ALLOWED_IMAGE_TYPES.includes(file.type) ||
			ALLOWED_IMAGE_EXTENSION.test(file.name)

		if (!hasAllowedType) {
			setFileError('Поддерживаются только SVG, PNG, JPG и GIF')
			return
		}

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

			setValue('attachment', file, {
				shouldDirty: true,
				shouldValidate: true
			})
		} catch {
			setFileError('Не удалось прочитать выбранное изображение')
		}
	}

	function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]

		if (file) {
			void handleImageFile(file)
		}

		event.target.value = ''
	}

	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault()

		const file = event.dataTransfer.files?.[0]

		if (file) {
			void handleImageFile(file)
		}
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
		setPendingRequest(values)
		setIsConfirmDialogOpen(true)
	}

	function handleConfirmCreateRequest() {
		if (!pendingRequest) {
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
				className='grid min-h-0 flex-1 gap-5 xl:grid-cols-2'
			>
				<div className='bg-card min-h-[620px] rounded-3xl border p-8'>
					<div className='flex flex-col gap-8'>
						{fields.map((field, index) => {
							const selectedRegionId = selectedRegions[index]?.regionId ?? ''

							const selectedRegion = getRegion(selectedRegionId)

							const amount = Number(selectedRegions[index]?.amount)

							const exceedsLimit =
								selectedRegion &&
								Number.isFinite(amount) &&
								amount > selectedRegion.limit

							return (
								<div
									key={field.id}
									className={cn(
										'flex flex-col gap-5',
										index < fields.length - 1 && 'border-b border-dashed pb-8'
									)}
								>
									<div className='flex items-center gap-3'>
										<Controller
											control={control}
											name={`regions.${index}.regionId`}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className='h-14 flex-1 rounded-lg px-4 text-base'>
														<SelectValue placeholder='Регион' />
													</SelectTrigger>

													<SelectContent>
														{regions.map(region => (
															<SelectItem
																key={region.id}
																value={region.id}
																disabled={isRegionAlreadySelected(
																	region.id,
																	index
																)}
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
												variant='ghost'
												size='icon'
												onClick={() => handleRemoveRegion(index)}
												className='text-destructive hover:text-destructive size-10 shrink-0'
											>
												<Trash2 className='size-5' />
											</Button>
										)}
									</div>

									{errors.regions?.[index]?.regionId && (
										<p className='text-destructive text-sm'>
											{errors.regions[index]?.regionId?.message}
										</p>
									)}

									<div className='relative'>
										<span className='text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base'>
											USDT
										</span>

										<Input
											type='number'
											inputMode='decimal'
											step='any'
											placeholder='0.00000'
											className='h-14 rounded-lg pr-4 pl-17 text-base'
											{...register(`regions.${index}.amount`)}
										/>
									</div>

									{errors.regions?.[index]?.amount && (
										<p className='text-destructive text-sm'>
											{errors.regions[index]?.amount?.message}
										</p>
									)}

									<p className='text-base'>
										Лимит:{' '}
										<span className='text-chart-2'>
											{selectedRegion
												? `${formatAmount(selectedRegion.limit)} USDT`
												: '—'}
										</span>
									</p>

									{exceedsLimit && (
										<div className='bg-chart-2/15 text-chart-2 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium'>
											<Info className='size-4 shrink-0' />
											Оплата может превысить лимит
										</div>
									)}
								</div>
							)
						})}

						{typeof errors.regions?.message === 'string' && (
							<p className='text-destructive text-sm'>
								{errors.regions.message}
							</p>
						)}

						<Button
							type='button'
							variant='outline'
							onClick={handleAddRegion}
							disabled={fields.length >= regions.length}
							className='border-primary text-primary w-fit rounded-xl'
						>
							+ Добавить регион
						</Button>
					</div>
				</div>

				<div className='bg-card flex flex-col rounded-3xl border p-8'>
					<div className='bg-primary/15 text-primary flex min-h-14 items-center gap-3 rounded-lg px-4 font-semibold'>
						<span>Общая сумма по всем регионам</span>

						<span className='text-2xl font-bold'>
							{formatAmount(totalAmount)}
						</span>
					</div>

					<div className='mt-10 flex flex-col gap-8'>
						<div>
							<div className='flex'>
								<Input
									placeholder='Кошелек'
									className='h-14 rounded-l-lg rounded-r-none px-4 text-base'
									{...register('wallet')}
								/>

								<Button
									type='button'
									variant='outline'
									onClick={handlePasteWallet}
									className='h-14 rounded-l-none rounded-r-lg border-l-0 px-5'
								>
									Вставить
								</Button>
							</div>

							{errors.wallet && (
								<p className='text-destructive mt-2 text-sm'>
									{errors.wallet.message}
								</p>
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
										<SelectTrigger className='h-14 rounded-lg px-4 text-base'>
											<SelectValue placeholder='Цель оплаты' />
										</SelectTrigger>

										<SelectContent>
											{paymentGoals.map(goal => (
												<SelectItem
													key={goal.id}
													value={goal.id}
												>
													{goal.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							{errors.paymentGoalId && (
								<p className='text-destructive mt-2 text-sm'>
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
										onValueChange={field.onChange}
									>
										<SelectTrigger className='h-14 rounded-lg px-4 text-base'>
											<SelectValue placeholder='Срок жизни заявки' />
										</SelectTrigger>

										<SelectContent>
											{lifetimes.map(lifetime => (
												<SelectItem
													key={lifetime.id}
													value={lifetime.id}
												>
													{lifetime.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							{errors.lifetimeId && (
								<p className='text-destructive mt-2 text-sm'>
									{errors.lifetimeId.message}
								</p>
							)}
						</div>

						<ImageUpload
							file={attachment}
							error={fileError}
							fileInputRef={fileInputRef}
							onInputChange={handleFileInputChange}
							onDrop={handleDrop}
							onRemove={handleRemoveAttachment}
						/>

						<div className='bg-chart-2/15 text-chart-2 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium'>
							<Info className='size-4 shrink-0' />
							После окончания указанного времени неоплаченная заявка будет
							автоматически отменена.
						</div>

						<p className='text-base'>
							{selectedLifetime && expiresAt ? (
								<>
									Заявка будет активна {selectedLifetime.label.toLowerCase()},
									до {formatDateTime(expiresAt)}.
								</>
							) : (
								'Выберите срок жизни заявки.'
							)}
						</p>
					</div>

					<div className='mt-auto grid grid-cols-2 gap-4 pt-8'>
						<Button
							type='button'
							variant='outline'
							onClick={handleResetForm}
							className='border-primary text-primary h-14 text-lg font-semibold'
						>
							Отменить заявку
						</Button>

						<Button
							type='submit'
							className='h-14 text-lg font-semibold'
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
		<div className='flex flex-col gap-3'>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/svg+xml,image/png,image/jpeg,image/gif,.svg,.png,.jpg,.jpeg,.gif'
				onChange={onInputChange}
				className='hidden'
			/>

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
				className='hover:bg-muted/30 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border p-5 text-center transition-colors'
			>
				<div className='mb-3 flex size-10 items-center justify-center rounded-lg border'>
					<UploadCloud className='size-5' />
				</div>

				<p className='text-muted-foreground text-sm'>
					<span className='text-primary font-semibold'>Click to upload</span> or
					drag and drop
				</p>

				<p className='text-muted-foreground mt-1 text-sm'>
					SVG, PNG, JPG or GIF (max. 800×400px)
				</p>
			</div>

			{file && (
				<div className='flex items-center gap-3 rounded-xl border px-4 py-3'>
					<div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg'>
						<FileImage className='size-5' />
					</div>

					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-semibold'>{file.name}</p>

						<p className='text-muted-foreground text-xs'>
							{formatFileSize(file.size)} — 100% uploaded
						</p>
					</div>

					<div className='bg-primary flex size-5 shrink-0 items-center justify-center rounded'>
						<Check className='text-primary-foreground size-3.5' />
					</div>

					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={event => {
							event.stopPropagation()
							onRemove()
						}}
						className='text-destructive size-8'
					>
						<Trash2 className='size-4' />
					</Button>
				</div>
			)}

			{error && <p className='text-destructive text-sm'>{error}</p>}
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
	onConfirm
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
			<DialogContent className='max-h-[90vh] w-[calc(100%-32px)] max-w-[1250px] overflow-hidden rounded-3xl border-0 p-8 shadow-2xl sm:max-w-[1250px]'>
				<DialogHeader className='sr-only'>
					<DialogTitle>Подтверждение создания заявки</DialogTitle>

					<DialogDescription>
						Проверьте данные перед созданием заявки
					</DialogDescription>
				</DialogHeader>

				<div className='grid min-h-0 gap-5 xl:grid-cols-2'>
					<div className='max-h-[620px] overflow-y-auto rounded-3xl border p-8'>
						<div className='flex flex-col gap-7'>
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
												'border-b border-dashed pb-7'
										)}
									>
										<PreviewField>{region?.label ?? '—'}</PreviewField>

										<PreviewField>
											<span className='text-primary mr-2'>USDT</span>

											{formatAmount(Number(regionPayment.amount))}
										</PreviewField>

										<p>
											Лимит:{' '}
											<span className='text-chart-2'>
												{region ? `${formatAmount(region.limit)} USDT` : '—'}
											</span>
										</p>
									</div>
								)
							})}
						</div>
					</div>

					<div className='flex max-h-[620px] flex-col overflow-y-auto rounded-3xl border p-8'>
						<div className='bg-primary/15 text-primary flex min-h-14 items-center gap-3 rounded-lg px-4 font-semibold'>
							<span>Общая сумма по всем регионам</span>

							<span className='text-2xl font-bold'>
								{formatAmount(totalAmount)}
							</span>
						</div>

						<div className='mt-8 flex flex-col gap-6'>
							<PreviewField>{request.wallet}</PreviewField>

							<PreviewField>{paymentGoal?.label ?? '—'}</PreviewField>

							<PreviewField>{lifetime?.label ?? '—'}</PreviewField>

							<div className='rounded-xl border p-4'>
								{request.attachment ? (
									<div className='flex items-center gap-3'>
										<FileImage className='text-primary size-7' />

										<div className='min-w-0'>
											<p className='truncate font-semibold'>
												{request.attachment.name}
											</p>

											<p className='text-muted-foreground text-sm'>
												{formatFileSize(request.attachment.size)}
											</p>
										</div>
									</div>
								) : (
									<p className='text-muted-foreground'>
										Изображение не загружено
									</p>
								)}
							</div>

							{lifetime && expiresAt && (
								<p>
									Заявка будет активна {lifetime.label.toLowerCase()}, до{' '}
									{formatDateTime(expiresAt)}.
								</p>
							)}
						</div>
					</div>
				</div>

				<div className='mt-8 ml-auto grid w-full max-w-[580px] grid-cols-2 gap-4'>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
						className='border-primary text-primary h-14 text-lg font-semibold'
					>
						Отменить заявку
					</Button>

					<Button
						type='button'
						onClick={onConfirm}
						className='h-14 text-lg font-semibold'
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
		<div className='flex min-h-14 items-center rounded-lg border px-4 text-base'>
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
			<DialogContent className='w-[calc(100%-32px)] max-w-[630px] rounded-3xl border-0 px-14 py-16 shadow-2xl sm:max-w-[630px]'>
				<DialogHeader>
					<DialogTitle className='text-center text-3xl font-bold'>
						Заявка успешно создана
					</DialogTitle>

					<DialogDescription className='sr-only'>
						Информация о созданной заявке
					</DialogDescription>
				</DialogHeader>

				<div className='mt-8 flex flex-col items-center gap-8 text-center'>
					<p className='text-lg'>
						Номер заявки:{' '}
						<span className='text-primary font-semibold'>{requestNumber}</span>
					</p>

					<span className='bg-chart-3/20 text-chart-3 rounded-xl px-4 py-2 text-sm font-bold'>
						In Progress
					</span>

					{lifetime && expiresAt && (
						<p className='text-lg'>
							Заявка будет активна {lifetime.label.toLowerCase()}, до{' '}
							{formatDateTime(expiresAt)}.
						</p>
					)}

					<Button
						type='button'
						onClick={onCreateNew}
						className='mt-4 h-14 w-full text-lg font-semibold'
					>
						Создать новую заявку
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
