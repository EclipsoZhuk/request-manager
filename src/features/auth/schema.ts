import { z } from 'zod'

export const userRoleSchema = z.enum(['manager', 'admin'])

export type UserRole = z.infer<typeof userRoleSchema>

export const authUserSchema = z.object({
	id: z.string().min(1),
	login: z.string().min(1),
	role: userRoleSchema,
	domainId: z.string().min(1)
})

export type AuthUser = z.infer<typeof authUserSchema>

export const loginSchema = z.object({
	login: z
		.string()
		.trim()
		.min(1, 'Введите логин')
		.min(3, 'Логин должен содержать минимум 3 символа')
		.max(64, 'Логин не должен превышать 64 символа'),

	password: z
		.string()
		.min(1, 'Введите пароль')
		.min(6, 'Пароль должен содержать минимум 6 символов')
		.max(128, 'Пароль не должен превышать 128 символов'),

	domain: z.string().trim().min(1, 'Выберите домен')
})

export type LoginInput = z.infer<typeof loginSchema>

export const backendLoginResponseSchema = z.object({
	accessToken: z.string().min(1),

	expiresIn: z.number().int().positive().optional(),

	user: authUserSchema
})

export type BackendLoginResponse = z.infer<typeof backendLoginResponseSchema>
