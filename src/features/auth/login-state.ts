export type LoginFieldErrors = {
	login?: string[]
	password?: string[]
	domain?: string[]
}

export type LoginActionState = {
	message: string | null
	fieldErrors: LoginFieldErrors
	values: {
		login: string
		domain: string
	}
}

export const initialLoginState: LoginActionState = {
	message: null,
	fieldErrors: {},
	values: {
		login: '',
		domain: ''
	}
}
