import type { LoginInput } from './schema'

export type LoginActionResult = {
	success: false
	message?: string
	fieldErrors?: Partial<Record<keyof LoginInput, string[]>>
}
