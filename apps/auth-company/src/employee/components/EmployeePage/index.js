import { useContext } from 'react'
import { Button, Typography } from '@mui/material'
import { AuthContext } from '../../../utils/contexts/AuthContext'
import { UserLayout } from '../../../utils/components/UserLayout'
import { ADMIN_ROLE } from '../../../const'

export const EmployeePage = () => {
	const { user } = useContext(AuthContext)
	return (
		<UserLayout user={user}>
			<Typography component='h1' variant='h5'>
				Admin Page
			</Typography>
			<Typography component='h1' variant='h5'>
				Employee Page
			</Typography>
			{user.role === ADMIN_ROLE && <Button type='button'>Delete</Button>}
		</UserLayout>
	)
}

export default { EmployeePage }
