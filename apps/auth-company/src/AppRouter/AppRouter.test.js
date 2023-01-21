import { screen, fireEvent } from '@testing-library/react'
import { AppRouter } from '.'
import {
	renderWithAuthProvider,
	goTo,
	fillInputs,
	getSendButton,
} from '../utils/tests'
import { handlers } from '../mocks/handlers'
import { setupServer } from 'msw/node'
import {
	ADMIN_EMAIL,
	ADMIN_ROLE,
	EMPLOYEE_EMAIL,
	EMPLOYEE_ROLE,
} from '../const'

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when the user is not authenticated and enters on admin page', () => {
	it('must be redirected to login page', () => {
		goTo('/admin')
		renderWithAuthProvider(<AppRouter />)

		expect(screen.getByText(/login page/i)).toBeInTheDocument()
	})
})

describe('when the user is not authenticated and enters on employee page', () => {
	it('must be redirected to login page', () => {
		goTo('/employee')
		renderWithAuthProvider(<AppRouter />)

		expect(screen.getByText(/login page/i)).toBeInTheDocument()
	})
})

describe('when the admin is authenticated  in login page', () => {
	it('must be redirected to admin page', async () => {
		// go to login page
		renderWithAuthProvider(<AppRouter />)
		// fill form as admin
		fillInputs({ email: ADMIN_EMAIL })
		// submit form
		fireEvent.click(getSendButton())
		// expect admin page
		expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
		expect(await screen.findByText(/john doe/i)).toBeInTheDocument()
	})
})

describe('when the admin goes to employee page', () => {
	it('must have access', () => {
		goTo('/admin')
		renderWithAuthProvider(<AppRouter />, { isAuth: true, role: ADMIN_ROLE })
		fireEvent.click(screen.getByText(/employee/i))
		expect(screen.getByText(/^employee page/i)).toBeInTheDocument()
	})
})

describe('when the employee is authenticated  in login page', () => {
	it('must be redirected to employee page', async () => {
		// go to login page
		renderWithAuthProvider(<AppRouter />)
		// fill form as admin
		fillInputs({ email: EMPLOYEE_EMAIL })
		// submit form
		fireEvent.click(getSendButton())
		// expect admin page
		expect(await screen.findByText(/employee page/i)).toBeInTheDocument()
	})
})

describe('when the employee goes to admin page', () => {
	it('must be redirected to employee page', async () => {
		goTo('/admin')
		renderWithAuthProvider(<AppRouter />, { isAuth: true, role: EMPLOYEE_ROLE })
		expect(screen.getByText(/employee page/i)).toBeInTheDocument()
	})
})
