import { Route, Redirect } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { AuthContext } from '../../contexts/AuthContext'
import { useContext } from 'react'

export const PrivateRoute = ({ children, path, allowRoles }) => {
	const {
		isAuth,
		user: { role },
	} = useContext(AuthContext)

	const getIsAllowed = () => {
		if (allowRoles.length > 0) {
			return allowRoles.includes(role)
		}
		return true
	}

	return (
		<Route path={path} exact>
			{isAuth && getIsAllowed() ? children : <Redirect to='/' />}
		</Route>
	)
}

export default { PrivateRoute }

PrivateRoute.propTypes = {
	children: PropTypes.node.isRequired,
	path: PropTypes.string.isRequired,
	allowRoles: PropTypes.arrayOf(PropTypes.string),
}

PrivateRoute.defaultProps = {
	allowRoles: [],
}
