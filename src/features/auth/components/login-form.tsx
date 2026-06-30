'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import { getAuthErrorMessage } from '../api/auth.api'
import { AUTH_DOMAINS } from '../auth.constants'
import { useLogin } from '../hooks/use-login'
import { type LoginFormValues, loginSchema } from '../schemas/login.schema'

export function LoginForm() {
	const router = useRouter()
	const loginMutation = useLogin()

	const {
		register,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			login: '',
			password: '',
			domain: ''
		}
	})

	const onSubmit = handleSubmit(async values => {
		try {
			const response = await loginMutation.mutateAsync(values)

			router.replace(response.redirectTo)
			router.refresh()
		} catch {
			// Ошибка выводится через loginMutation.error
		}
	})

	const apiError = loginMutation.error
		? getAuthErrorMessage(loginMutation.error)
		: null

	return (
		<div className='bg-card w-full max-w-135 rounded-2xl border px-8 py-12 shadow-sm sm:px-14 sm:py-16'>
			<div className='mb-10 flex flex-col items-center'>
				<Zap className='fill-primary text-primary mb-7 size-10' />

				<h1 className='text-3xl font-semibold'>Логин</h1>
			</div>

			<form
				onSubmit={onSubmit}
				className='space-y-6'
				noValidate
			>
				<div className='space-y-2'>
					<Label htmlFor='login'>Логин</Label>

					<Input
						id='login'
						placeholder='Логин'
						autoComplete='username'
						aria-invalid={Boolean(errors.login)}
						className='h-12'
						{...register('login')}
					/>

					{errors.login && (
						<p className='text-destructive text-sm'>{errors.login.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='password'>Пароль</Label>

					<Input
						id='password'
						type='password'
						placeholder='Пароль'
						autoComplete='current-password'
						aria-invalid={Boolean(errors.password)}
						className='h-12'
						{...register('password')}
					/>

					{errors.password && (
						<p className='text-destructive text-sm'>
							{errors.password.message}
						</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='domain'>Выбор домена</Label>

					<Controller
						control={control}
						name='domain'
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									id='domain'
									aria-invalid={Boolean(errors.domain)}
									className='h-12 w-full'
								>
									<SelectValue placeholder='Выбор домена' />
								</SelectTrigger>

								<SelectContent>
									{AUTH_DOMAINS.map(domain => (
										<SelectItem
											key={domain.value}
											value={domain.value}
										>
											{domain.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>

					{errors.domain && (
						<p className='text-destructive text-sm'>{errors.domain.message}</p>
					)}
				</div>

				{apiError && (
					<div
						role='alert'
						className='bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm'
					>
						{apiError}
					</div>
				)}

				<Button
					type='submit'
					disabled={loginMutation.isPending}
					className='mt-8 h-12 w-full text-base'
				>
					{loginMutation.isPending ? 'Выполняется вход...' : 'Войти'}
				</Button>
			</form>
		</div>
	)
}
