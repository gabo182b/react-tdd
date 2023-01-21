import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { AuthContext } from '../../contexts/AuthContext'

export const AuthGuard = ({ children, isAuth, initialRole }) => {
	const [isUserAuth, setIsUserAuth] = useState(isAuth)
	const [user, setUser] = useState({ role: initialRole, username: '' })

	const handleSuccessLogin = ({ role, username }) => {
		setUser({ role, username })
		setIsUserAuth(true)
	}

	const authProviderValue = {
		isAuth: isUserAuth,
		handleSuccessLogin,
		user,
	}

	return (
		<AuthContext.Provider value={authProviderValue}>
			{children}
		</AuthContext.Provider>
	)
}

export default { AuthGuard }

AuthGuard.propTypes = {
	children: PropTypes.node.isRequired,
	isAuth: PropTypes.bool,
	initialRole: PropTypes.string,
}

AuthGuard.defaultProps = {
	isAuth: false,
	initialRole: '',
}
