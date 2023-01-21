import { screen } from '@testing-library/react'
import { AdminPage } from '.'
import { AuthContext } from '../../../utils/contexts/AuthContext'
import { renderWithAuthProvider } from '../../../utils/tests'

describe('when the admin page is mounted', () => {
	it('must display the admin username', () => {
		renderWithAuthProvider(
			<AuthContext.Provider value={{ user: { username: 'John Doe' } }}>
				<AdminPage />
			</AuthContext.Provider>
		)

		expect(screen.getByText(/john doe/i)).toBeInTheDocument()
	})
})
