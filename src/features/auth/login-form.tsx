'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { loginAction } from './actions'
import { initialLoginState } from './login-state'

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(
		loginAction,
		initialLoginState
	)

	const loginError = state.fieldErrors.login?.[0]

	const passwordError = state.fieldErrors.password?.[0]

	const domainError = state.fieldErrors.domain?.[0]

	return (
		<form
			action={formAction}
			className='space-y-6'
			noValidate
		>
			<div className='space-y-2'>
				<Label htmlFor='login'>Логин</Label>

				<Input
					id='login'
					name='login'
					type='text'
					defaultValue={state.values.login}
					placeholder='Логин'
					autoComplete='username'
					minLength={3}
					maxLength={64}
					aria-invalid={Boolean(loginError)}
					aria-describedby={loginError ? 'login-error' : undefined}
					className='h-12'
				/>

				{loginError && (
					<p
						id='login-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{loginError}
					</p>
				)}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='password'>Пароль</Label>

				<Input
					id='password'
					name='password'
					type='password'
					placeholder='Пароль'
					autoComplete='current-password'
					minLength={6}
					maxLength={128}
					aria-invalid={Boolean(passwordError)}
					aria-describedby={passwordError ? 'password-error' : undefined}
					className='h-12'
				/>

				{passwordError && (
					<p
						id='password-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{passwordError}
					</p>
				)}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='domain'>Выбор домена</Label>

				<select
					id='domain'
					name='domain'
					defaultValue={state.values.domain}
					aria-invalid={Boolean(domainError)}
					aria-describedby={domainError ? 'domain-error' : undefined}
					className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-12 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]'
				>
					<option
						value=''
						disabled
					>
						Выбор домена
					</option>

					<option value='domain-1'>Домен 1</option>
				</select>

				{domainError && (
					<p
						id='domain-error'
						role='alert'
						className='text-destructive text-sm'
					>
						{domainError}
					</p>
				)}
			</div>

			{state.message && (
				<div
					role='alert'
					className='bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm'
				>
					{state.message}
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
