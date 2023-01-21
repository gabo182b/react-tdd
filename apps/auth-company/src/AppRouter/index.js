import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { LoginPage } from '../auth/components/LoginPage'
import { PrivateRoute } from '../utils/components/PrivateRoute'
import { AdminPage } from '../admin/components/AdminPage'
import { EmployeePage } from '../employee/components/EmployeePage'
import { ADMIN_ROLE } from '../const'

export const AppRouter = () => {
	return (
		<Router>
			<Switch>
				<Route path='/' exact>
					<LoginPage />
				</Route>
				<PrivateRoute path='/admin' allowRoles={[ADMIN_ROLE]}>
					<AdminPage />
				</PrivateRoute>
				<PrivateRoute path='/employee'>
					<EmployeePage />
				</PrivateRoute>
			</Switch>
		</Router>
	)
}

export default { AppRouter }
