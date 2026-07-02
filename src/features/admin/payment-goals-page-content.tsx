'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import type { AdminPaymentGoal } from './mock'
import { cn } from '@/lib/utils'

type PaymentGoalsPageContentProps = {
	initialPaymentGoals: AdminPaymentGoal[]
}

export function PaymentGoalsPageContent({
	initialPaymentGoals
}: PaymentGoalsPageContentProps) {
	const [paymentGoals, setPaymentGoals] = useState(initialPaymentGoals)

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

	function handleAddPaymentGoal() {
		const newGoal: AdminPaymentGoal = {
			id: crypto.randomUUID(),
			title: 'Новая цель оплаты',
			isActive: true
		}

		setPaymentGoals(currentGoals => [...currentGoals, newGoal])
	}

	return (
		<section className='flex min-h-0 flex-1 flex-col gap-4'>
			<div className='bg-card overflow-hidden rounded-xl border'>
				<div className='overflow-x-auto'>
					<Table className='min-w-[800px] table-fixed'>
						<TableHeader>
							<TableRow className='bg-[#FCFDFD] hover:bg-[#FCFDFD]'>
								<TableHead className='w-34 font-bold'>Статус</TableHead>

								<TableHead className='font-bold'>Цели оплат</TableHead>

								<TableHead className='w-25 text-center font-bold'>
									Изменить
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{paymentGoals.map(paymentGoal => (
								<TableRow
									key={paymentGoal.id}
									className='hover:bg-muted h-[72px]'
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
											'leading-5',
											paymentGoal.isDisabled && 'text-muted-foreground/50'
										)}
									>
										{paymentGoal.title}
									</TableCell>

									<TableCell className='text-center'>
										<Button
											type='button'
											variant='outline'
											size='icon'
											disabled={paymentGoal.isDisabled}
											aria-label={`Редактировать ${paymentGoal.title}`}
											className='border-primary text-primary size-10 rounded-xl disabled:opacity-40'
										>
											<Pencil className='size-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}

							{paymentGoals.length === 0 && (
								<TableRow>
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
				onClick={handleAddPaymentGoal}
				className='h-14 w-full max-w-104 rounded-md text-lg font-semibold'
			>
				Добавить новую цель
			</Button>
		</section>
	)
}
