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
			className='space-y-10'
			noValidate
		>
			<div className='space-y-4'>
				<Label htmlFor='login'>Логин</Label>

				<div className='space-y-2'>
					<Input
						id='login'
						type='text'
						placeholder='Логин'
						autoComplete='username'
						disabled={isPending}
						aria-invalid={Boolean(errors.login)}
						aria-describedby={errors.login ? 'login-error' : undefined}
						{...register('login')}
					/>

					{errors.login?.message && (
						<p
							id='login-error'
							role='alert'
							className='text-destructive'
						>
							{errors.login.message}
						</p>
					)}
				</div>
			</div>

			<div className='space-y-4'>
				<Label htmlFor='password'>Пароль</Label>

				<div className='space-y-2'>
					<Input
						id='password'
						type='password'
						placeholder='Пароль'
						autoComplete='current-password'
						disabled={isPending}
						aria-invalid={Boolean(errors.password)}
						aria-describedby={errors.password ? 'password-error' : undefined}
						{...register('password')}
					/>

					{errors.password?.message && (
						<p
							id='password-error'
							role='alert'
							className='text-destructive'
						>
							{errors.password.message}
						</p>
					)}
				</div>
			</div>

			<div className='mb-0 space-y-4'>
				<Label htmlFor='domain'>Выбор домена</Label>

				<div className='space-y-2'>
					<Controller
						name='domain'
						control={control}
						render={({ field }) => (
							<Select
								value={field.value || undefined}
								onValueChange={value => {
									field.onChange(value)
									clearErrors('domain')
									clearErrors('root.server')
								}}
								disabled={isPending}
							>
								<SelectTrigger
									id='domain'
									aria-invalid={Boolean(errors.domain)}
									aria-describedby={errors.domain ? 'domain-error' : undefined}
									className='w-full'
								>
									<SelectValue placeholder='Выбор домена' />
								</SelectTrigger>

								<SelectContent
									position='popper'
									align='start'
									sideOffset={8}
								>
									{[1, 2, 3, 4, 5].map(domain => (
										<SelectItem
											key={domain}
											value={`domain-${domain}`}
											className='focus:border-border text-muted-foreground data-[state=checked]:border-border h-12 rounded-lg border border-transparent px-3 text-sm font-bold focus:bg-white data-[state=checked]:bg-white'
										>
											{domain}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>

					{errors.domain?.message && (
						<p
							id='domain-error'
							role='alert'
							className='text-destructive'
						>
							{errors.domain.message}
						</p>
					)}
				</div>
			</div>

			<div className='mt-15 space-y-5'>
				{errors.root?.server?.message && (
					<p
						role='alert'
						className='text-destructive text-center'
					>
						{errors.root.server.message}
					</p>
				)}
				<Button
					type='submit'
					size='lg'
					disabled={isPending}
					className='w-full'
				>
					{isPending ? 'Выполняется вход...' : 'Войти'}
				</Button>
			</div>
		</form>
	)
}
