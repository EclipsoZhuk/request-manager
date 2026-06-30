'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
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

import { loginAction } from './actions'
import { type LoginInput, loginSchema } from './schema'

const DEFAULT_VALUES: LoginInput = {
	login: '',
	password: '',
	domain: ''
}

export function LoginForm() {
	const [isPending, startTransition] = useTransition()

	const {
		register,
		control,
		handleSubmit,
		clearErrors,
		setError,
		formState: { errors }
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: DEFAULT_VALUES,
		mode: 'onSubmit',
		reValidateMode: 'onChange'
	})

	const onSubmit = handleSubmit(values => {
		clearErrors()

		startTransition(async () => {
			const result = await loginAction(values)

			if (result.fieldErrors) {
				for (const [field, messages] of Object.entries(result.fieldErrors)) {
					const message = messages?.[0]

					if (!message) {
						continue
					}

					setError(field as keyof LoginInput, {
						type: 'server',
						message
					})
				}
			}

			if (result.message) {
				setError('root.server', {
					type: 'server',
					message: result.message
				})
			}
		})
	})

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
			noValidate
		>
			<div className='space-y-2'>
				<Label htmlFor='login'>Логин</Label>

				<Input
					id='login'
					type='text'
					placeholder='Логин'
					autoComplete='username'
					disabled={isPending}
					aria-invalid={Boolean(errors.login)}
					aria-describedby={errors.login ? 'login-error' : undefined}
					className='h-12'
					{...register('login')}
				/>

				{errors.login?.message && (
					<p
						id='login-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{errors.login.message}
					</p>
				)}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='password'>Пароль</Label>

				<Input
					id='password'
					type='password'
					placeholder='Пароль'
					autoComplete='current-password'
					disabled={isPending}
					aria-invalid={Boolean(errors.password)}
					aria-describedby={errors.password ? 'password-error' : undefined}
					className='h-12'
					{...register('password')}
				/>

				{errors.password?.message && (
					<p
						id='password-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{errors.password.message}
					</p>
				)}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='domain'>Выбор домена</Label>

				<Controller
					name='domain'
					control={control}
					render={({ field }) => (
						<Select
							value={field.value || undefined}
							onValueChange={field.onChange}
							disabled={isPending}
						>
							<SelectTrigger
								id='domain'
								aria-invalid={Boolean(errors.domain)}
								aria-describedby={errors.domain ? 'domain-error' : undefined}
								className='h-12 w-full'
							>
								<SelectValue placeholder='Выбор домена' />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value='domain-1'>Домен 1</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>

				{errors.domain?.message && (
					<p
						id='domain-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{errors.domain.message}
					</p>
				)}
			</div>

			{errors.root?.server?.message && (
				<div
					role='alert'
					className='bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm'
				>
					{errors.root.server.message}
				</div>
			)}

			<Button
				type='submit'
				disabled={isPending}
				className='h-12 w-full'
			>
				{isPending ? 'Выполняется вход...' : 'Войти'}
			</Button>
		</form>
	)
}
