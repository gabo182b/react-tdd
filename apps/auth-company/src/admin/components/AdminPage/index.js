import { useContext } from 'react'
import { Typography } from '@mui/material'
import { AuthContext } from '../../../utils/contexts/AuthContext'
import { UserLayout } from '../../../utils/components/UserLayout'

export const AdminPage = () => {
	const { user } = useContext(AuthContext)
	return (
		<UserLayout user={user}>
			<Typography component='h1' variant='h5'>
				Admin Page
			</Typography>
		</UserLayout>
	)
}

export default { AdminPage }
