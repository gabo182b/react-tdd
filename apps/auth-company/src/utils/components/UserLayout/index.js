import { PropTypes } from 'prop-types'
import { Button, Typography, AppBar, Toolbar, Container } from '@mui/material'
import { Link } from 'react-router-dom'

export const UserLayout = ({ user, children }) => (
	<Container>
		<AppBar position='static'>
			<Toolbar>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					{user.username}
				</Typography>
				<Button component={Link} color='inherit' to='/employee'>
					Employee
				</Button>
			</Toolbar>
		</AppBar>
		{children}
	</Container>
)

export default {
	UserLayout,
}

UserLayout.propTypes = {
	user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
	children: PropTypes.node.isRequired,
}
