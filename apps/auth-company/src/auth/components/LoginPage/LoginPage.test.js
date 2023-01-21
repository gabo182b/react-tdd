import { LoginPage } from '.'
import {
	screen,
	fireEvent,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react'
import { handlers, handlerInvalidCredentials } from '../../../mocks/handlers'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { HTTP_UNEXPECTED_ERROR_STATUS } from '../../../const'
import {
	renderWithRouter,
	fillInputs,
	getSendButton,
} from '../../../utils/tests'
import { AuthContext } from '../../../utils/contexts/AuthContext'

const passwordValidationMessage =
	'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const getPasswordInput = () => screen.getByLabelText(/password/i)

const server = setupServer(...handlers)

beforeEach(() =>
	renderWithRouter(
		<AuthContext.Provider
			value={{ handleSuccessLogin: jest.fn(), user: { role: '' } }}>
			<LoginPage />
		</AuthContext.Provider>
	)
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when login page is mounted', () => {
	it('must display the login title', () => {
		expect(screen.getByText(/login page/i)).toBeInTheDocument()
	})

	it('must have a form with the following fields: email, password and a submit button', () => {
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
		expect(getSendButton()).toBeInTheDocument()
	})
})

describe('when the user leaves empty fields and clicks the submit button', () => {
	it('should display required messages as the format: "The [field name] is required"', async () => {
		expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
		expect(
			screen.queryByText(/the password is required/i)
		).not.toBeInTheDocument()

		fireEvent.click(getSendButton())

		expect(screen.getByText(/the email is required/i)).toBeInTheDocument()
		expect(screen.getByText(/the password is required/i)).toBeInTheDocument()

		await waitFor(() => expect(getSendButton()).not.toBeDisabled())
	})
})

describe('when the user fills the fields and clicks the submit button', () => {
	it('must not display the required messages', async () => {
		fillInputs()

		fireEvent.click(getSendButton())

		expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()

		await waitFor(() => expect(getSendButton()).not.toBeDisabled())
	})
})

describe('when the user fills and blur the email input with an invalid email, and then focus and type a valid email', () => {
	it('must not display a validation message', () => {
		const emailInput = screen.getByLabelText(/email/i)
		// change and blur the email input
		fireEvent.change(emailInput, {
			target: { value: 'invalid.email' },
		})
		fireEvent.blur(emailInput)
		// expect
		expect(
			screen.getByText(/the email is invalid. Example: john.doe@mail.com/i)
		).toBeInTheDocument()
		// change and blur the email input
		fireEvent.change(emailInput, {
			target: { value: 'john.doe@mail.com' },
		})
		fireEvent.blur(emailInput)
		// expect, we put queryBy because is a value that we expect to no exist
		expect(
			screen.queryByText(/the email is invalid. Example: john.doe@mail.com/i)
		).not.toBeInTheDocument()
	})
})

describe('when the user fills and blur the password input with a value with 7 character length', () => {
	it('must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
		const passwordWithLengthOfSevenCharactersValue = 'asdfghj'
		// change and blur the password input
		fireEvent.change(getPasswordInput(), {
			target: { value: passwordWithLengthOfSevenCharactersValue },
		})
		fireEvent.blur(getPasswordInput())
		// expect
		expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
	})
})

describe('when the user fills and blur the password input with a value without one upper case character', () => {
	it('must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
		const passwordWithoutUppercaseValue = 'asdfghj8'
		// change and blur the password input
		fireEvent.change(getPasswordInput(), {
			target: { value: passwordWithoutUppercaseValue },
		})
		fireEvent.blur(getPasswordInput())
		// expect
		expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
	})
})

describe('when the user fills and blur the password input with a value without one number', () => {
	it('must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
		const passwordWithoutNumberValue = 'asdfghjA'
		// change and blur the password input
		fireEvent.change(getPasswordInput(), {
			target: { value: passwordWithoutNumberValue },
		})
		fireEvent.blur(getPasswordInput())
		// expect
		expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
	})
})

describe(`when the user fills and blur the password input without one special character and then 
change it with a valid value and blur again`, () => {
	it('must not display the validation messgae', () => {
		const passwordWithoutSpecialCharacterValue = 'asdfghjA1a'
		const valisPassword = 'aA1asdasda#'
		// change and blur the password input
		fireEvent.change(getPasswordInput(), {
			target: { value: passwordWithoutSpecialCharacterValue },
		})
		fireEvent.blur(getPasswordInput())
		// expect
		expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
		// change and blur the password input
		fireEvent.change(getPasswordInput(), {
			target: { value: valisPassword },
		})
		fireEvent.blur(getPasswordInput())
		// expect
		expect(
			screen.queryByText(passwordValidationMessage)
		).not.toBeInTheDocument()
	})
})

describe('when the user submits the login form with valid data', () => {
	it('must disable the submit button while the form page is fetching the data', async () => {
		fillInputs()

		fireEvent.click(getSendButton())

		expect(getSendButton()).toBeDisabled()

		await waitFor(() => expect(getSendButton()).not.toBeDisabled())
	})

	it('must be a loading indicator at the top of the form while it is fetching', async () => {
		expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()

		fillInputs()

		fireEvent.click(getSendButton())

		expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

		await waitForElementToBeRemoved(() =>
			screen.queryByTestId('loading-indicator')
		)
	})
})

describe('when the user submit the login form with valid data and there is an unexpected server error', () => {
	it('must display the error message "Unexpected error, please try again", from the API', async () => {
		// config the server
		server.use(
			rest.post('/login', (req, res, ctx) =>
				res(
					ctx.status(HTTP_UNEXPECTED_ERROR_STATUS),
					ctx.json({
						message: 'Unexpected error, please try again", from the API',
					})
				)
			)
		)

		expect(
			screen.queryByText(/unexpected error, please try again/i)
		).not.toBeInTheDocument()
		// trigger submit form
		fillInputs()

		fireEvent.click(getSendButton())
		// expect display error message
		expect(
			await screen.findByText(/unexpected error, please try again/i)
		).toBeInTheDocument()
	})
})

describe('when the user submit the login form with valid data and there is an invalid credentials error', () => {
	it('must display the error message "The email or password are not correct", from the API', async () => {
		const wrongEmail = 'wrong@mail.com'
		const wrongPassword = 'Aa12345678'
		// config the server
		server.use(handlerInvalidCredentials({ wrongEmail, wrongPassword }))

		expect(
			screen.queryByText(/the email or password are not correct/i)
		).not.toBeInTheDocument()
		// trigger submit form
		fillInputs({ email: wrongEmail, password: wrongPassword })

		fireEvent.click(getSendButton())
		// expect display error message
		expect(
			await screen.findByText(/the email or password are not correct/i)
		).toBeInTheDocument()
	})
})
