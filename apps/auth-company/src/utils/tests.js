import { BrowserRouter as Router } from 'react-router-dom'
import { screen, render, fireEvent } from '@testing-library/react'
import { AuthGuard } from '../utils/components/AuthGuard'

export const renderWithRouter = (ui, { route = '/' } = {}) => {
	window.history.pushState({}, 'Test Page', route)
	return render(ui, { wrapper: Router })
}

export const renderWithAuthProvider = (
	ui,
	{ isAuth = false, role = '' } = {}
) => {
	return render(
		<AuthGuard isAuth={isAuth} initialRole={role}>
			{ui}
		</AuthGuard>,
		{
			wrapper: Router,
		}
	)
}

export const goTo = (route) => window.history.pushState({}, 'Test Page', route)

export const fillInputs = ({
	email = 'john.doe@test.com',
	password = 'Aa12345!@#',
} = {}) => {
	fireEvent.change(screen.getByLabelText(/email/i), {
		target: { value: email },
	})

	fireEvent.change(screen.getByLabelText(/password/i), {
		target: { value: password },
	})
}

export const getSendButton = () => screen.getByRole('button', { name: /send/i })

export default {
	renderWithRouter,
	renderWithAuthProvider,
	goTo,
	fillInputs,
	getSendButton,
}
