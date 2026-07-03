'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

import type { AdminPaymentGoal } from './mock'
import { cn } from '@/lib/utils'

type PaymentGoalsPageContentProps = {
	initialPaymentGoals: AdminPaymentGoal[]
}

export function PaymentGoalsPageContent({
	initialPaymentGoals
}: PaymentGoalsPageContentProps) {
	const [paymentGoals, setPaymentGoals] = useState(initialPaymentGoals)

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
	const [draftTitle, setDraftTitle] = useState('')

	const isEditing = editingGoalId !== null
	const isSaveDisabled = draftTitle.trim().length === 0

	function handleStatusChange(id: string, checked: boolean) {
		setPaymentGoals(currentGoals =>
			currentGoals.map(goal =>
				goal.id === id
					? {
							...goal,
							isActive: checked
						}
					: goal
			)
		)
	}

	function handleOpenCreateDialog() {
		setEditingGoalId(null)
		setDraftTitle('')
		setIsDialogOpen(true)
	}

	function handleOpenEditDialog(paymentGoal: AdminPaymentGoal) {
		setEditingGoalId(paymentGoal.id)
		setDraftTitle(paymentGoal.title)
		setIsDialogOpen(true)
	}

	function handleDialogOpenChange(open: boolean) {
		setIsDialogOpen(open)

		if (!open) {
			setEditingGoalId(null)
			setDraftTitle('')
		}
	}

	function handleSave() {
		const normalizedTitle = draftTitle.trim()

		if (!normalizedTitle) {
			return
		}

		if (editingGoalId) {
			setPaymentGoals(currentGoals =>
				currentGoals.map(goal =>
					goal.id === editingGoalId
						? {
								...goal,
								title: normalizedTitle
							}
						: goal
				)
			)
		} else {
			const newGoal: AdminPaymentGoal = {
				id: crypto.randomUUID(),
				title: normalizedTitle,
				isActive: true
			}

			setPaymentGoals(currentGoals => [...currentGoals, newGoal])
		}

		handleDialogOpenChange(false)
	}

	return (
		<>
			<section className='flex min-h-0 flex-1 flex-col gap-4'>
				<div className='bg-card overflow-hidden rounded-xl border'>
					<div className='overflow-x-auto'>
						<Table className='min-w-200 table-fixed'>
							<TableHeader>
								<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
									<TableHead className='w-34'>Статус</TableHead>
									<TableHead>Цели оплат</TableHead>
									<TableHead className='w-30'>Изменить</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paymentGoals.map(paymentGoal => (
									<TableRow
										key={paymentGoal.id}
										className='h-18'
									>
										<TableCell>
											<Switch
												checked={paymentGoal.isActive}
												disabled={paymentGoal.isDisabled}
												onCheckedChange={(checked: boolean) =>
													handleStatusChange(paymentGoal.id, checked)
												}
												aria-label={`Изменить статус цели ${paymentGoal.title}`}
											/>
										</TableCell>

										<TableCell
											className={cn(
												paymentGoal.isDisabled && 'text-foreground/50'
											)}
										>
											{paymentGoal.title}
										</TableCell>

										<TableCell>
											<Button
												type='button'
												variant='outline'
												size='icon'
												disabled={paymentGoal.isDisabled}
												onClick={() => handleOpenEditDialog(paymentGoal)}
												aria-label={`Редактировать ${paymentGoal.title}`}
											>
												<Pencil />
											</Button>
										</TableCell>
									</TableRow>
								))}

								{paymentGoals.length === 0 && (
									<TableRow className='hover:bg-card'>
										<TableCell
											colSpan={3}
											className='text-muted-foreground h-80 text-center'
										>
											Цели оплат не найдены
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				<Button
					type='button'
					size='lg'
					onClick={handleOpenCreateDialog}
					className='max-w-104'
				>
					Добавить новую цель
				</Button>
			</section>

			<Dialog
				open={isDialogOpen}
				onOpenChange={handleDialogOpenChange}
			>
				<DialogContent className='max-w-157! gap-15 px-15 py-20'>
					<DialogHeader className='sr-only'>
						<DialogTitle>
							{isEditing
								? 'Редактирование цели оплаты'
								: 'Добавление цели оплаты'}
						</DialogTitle>

						<DialogDescription>Введите название цели оплаты</DialogDescription>
					</DialogHeader>

					<div className='flex flex-col gap-4'>
						<Label htmlFor='payment-goal-title'>Цели оплат</Label>

						<Textarea
							id='payment-goal-title'
							value={draftTitle}
							onChange={event => setDraftTitle(event.target.value)}
							placeholder='Введите цель оплаты'
							autoFocus
						/>
					</div>

					<DialogFooter className='grid grid-cols-2 gap-5'>
						<Button
							type='button'
							variant='outline'
							size='lg'
							onClick={() => handleDialogOpenChange(false)}
						>
							Отмена
						</Button>

						<Button
							type='button'
							disabled={isSaveDisabled}
							onClick={handleSave}
							size='lg'
						>
							Сохранить
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
