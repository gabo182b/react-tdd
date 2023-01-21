import { rest } from 'msw'
import {
	HTTP_INVALID_CREDENTIALS_STATUS,
	HTTP_OK_STATUS,
	ADMIN_ROLE,
	EMPLOYEE_ROLE,
	ADMIN_EMAIL,
	EMPLOYEE_EMAIL,
} from '../const'

export const handlers = [
	// Handles a POST /login request
	rest.post('/login', (req, res, ctx) => {
		// Persist user's authentication in the session
		sessionStorage.setItem('is-authenticated', 'true')
		let role = ''
		const { email } = req.body

		if (email === ADMIN_EMAIL) {
			role = ADMIN_ROLE
		}

		if (email === EMPLOYEE_EMAIL) {
			role = EMPLOYEE_ROLE
		}
		return res(
			// Respond with a 200 status code
			ctx.status(200),
			ctx.json({ user: { role, username: 'John Doe' } })
		)
	}),
]

export const handlerInvalidCredentials = ({ wrongEmail, wrongPassword }) =>
	rest.post('/login', (req, res, ctx) => {
		const { email, password } = req.body

		if (email === wrongEmail && password === wrongPassword) {
			return res(
				ctx.status(HTTP_INVALID_CREDENTIALS_STATUS),
				ctx.json({
					message: 'The email or password are not correct',
				})
			)
		}
		return res(ctx.status(HTTP_OK_STATUS))
	})

export default { handlers, handlerInvalidCredentials }
