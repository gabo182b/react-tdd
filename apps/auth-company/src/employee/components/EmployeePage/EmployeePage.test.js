import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { EmployeePage } from '.'
import { AuthContext } from '../../../utils/contexts/AuthContext'
import { ADMIN_ROLE, EMPLOYEE_ROLE } from '../../../const'

const renderWith = ({ role, username = 'John Doe' }) => {
	render(
		<AuthContext.Provider value={{ user: { username, role } }}>
			<EmployeePage />
		</AuthContext.Provider>,
		{ wrapper: Router }
	)
}

describe('when the admin access to employee page', () => {
	it('must have access to delete the employee button', () => {
		renderWith({ role: ADMIN_ROLE })

		expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
	})
})

describe('when the employee access to employee page', () => {
	it('must not have access to delete the employee button', () => {
		renderWith({ role: EMPLOYEE_ROLE })

		expect(
			screen.queryByRole('button', { name: /delete/i })
		).not.toBeInTheDocument()
	})

	it('the employee username should be displayed on the common navbar', () => {
		renderWith({ role: EMPLOYEE_ROLE, username: 'Joana Doe' })

		expect(screen.getByText(/joana doe/i)).toBeInTheDocument()
	})
})
