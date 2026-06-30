import 'server-only'

export class BackendError extends Error {
	constructor(
		message: string,
		public readonly status: number
	) {
		super(message)

		this.name = 'BackendError'
	}
}

type BackendRequestOptions = RequestInit & {
	accessToken?: string
}

function getBackendUrl() {
	const backendUrl = process.env.BACKEND_API_URL

	if (!backendUrl) {
		throw new Error('BACKEND_API_URL не настроен')
	}

	return backendUrl.replace(/\/$/, '')
}

export async function backendRequest<T>(
	path: string,
	options: BackendRequestOptions = {}
): Promise<T> {
	const { accessToken, headers, ...requestOptions } = options

	const response = await fetch(`${getBackendUrl()}${path}`, {
		...requestOptions,

		/*
		 * Авторизационные данные должны быть
		 * актуальными при каждом запросе.
		 */
		cache: 'no-store',

		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...headers,
			...(accessToken
				? {
						Authorization: `Bearer ${accessToken}`
					}
				: {})
		}
	})

	if (!response.ok) {
		let message = 'Ошибка запроса к серверу'

		try {
			const body = (await response.json()) as {
				message?: string
			}

			message = body.message ?? message
		} catch {
			// Ответ backend может не содержать JSON.
		}

		throw new BackendError(message, response.status)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json() as Promise<T>
}
