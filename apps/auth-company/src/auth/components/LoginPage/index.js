import { useState, useContext } from 'react'
import {
	Avatar,
	TextField,
	Button,
	CircularProgress,
	Snackbar,
	CssBaseline,
	Box,
	Typography,
	Container,
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { login } from '../../services'
import { Redirect } from 'react-router-dom'
import { ADMIN_ROLE, EMPLOYEE_ROLE } from '../../../const'
import { AuthContext } from '../../../utils/contexts/AuthContext'
import { validateEmail, validatePassword } from '../../../utils/helpers'

const passwordValidationMessageText =
	'The password must contain at least 8 characters, one upper case letter, one number and one special character'

export const LoginPage = () => {
	const { handleSuccessLogin, user } = useContext(AuthContext)
	const [emailValidationMessage, setEmailValidationMessage] = useState('')
	const [passwordlValidationMessage, setPasswordValidationMessage] =
		useState('')
	const [formValues, setFormValues] = useState({ email: '', password: '' })
	const [isFetching, setIsFetching] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const validateForm = () => {
		// const { email, password } = event.target.elements
		const { email, password } = formValues

		const isEmailEmpty = !email
		const isPasswordEmpty = !password

		if (isEmailEmpty) {
			setEmailValidationMessage('The email is required')
		}
		if (isPasswordEmpty) {
			setPasswordValidationMessage('The password is required')
		}

		return isEmailEmpty || isPasswordEmpty
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (validateForm()) {
			return
		}

		const { email, password } = formValues

		try {
			setIsFetching(true)
			const response = await login({ email, password })

			if (!response.ok) {
				throw response
			}

			const {
				user: { role, username },
			} = await response.json()
			handleSuccessLogin({ role, username })
		} catch (error) {
			const data = await error.json()
			setErrorMessage(data.message)
			setIsOpen(true)
		} finally {
			setIsFetching(false)
		}
	}

	const handleChange = ({ target: { value, name } }) => {
		setFormValues({ ...formValues, [name]: value })
	}

	const handleBlurEmail = () => {
		if (!validateEmail(formValues.email)) {
			setEmailValidationMessage(
				'The email is invalid. Example: john.doe@mail.com'
			)
			return
		}
		setEmailValidationMessage('')
	}

	const handleBlurPassword = () => {
		if (!validatePassword(formValues.password)) {
			setPasswordValidationMessage(passwordValidationMessageText)
			return
		}

		setPasswordValidationMessage(' ')
	}

	const handleClose = () => setIsOpen(false)

	if (!isFetching && user.role === ADMIN_ROLE) {
		return <Redirect to='/admin' />
	}

	if (!isFetching && user.role === EMPLOYEE_ROLE) {
		return <Redirect to='/employee' />
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlined />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Login Page
				</Typography>
				{isFetching && <CircularProgress data-testid='loading-indicator' />}
				<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						label='email'
						id='email'
						name='email'
						helperText={emailValidationMessage}
						onChange={handleChange}
						onBlur={handleBlurEmail}
						value={formValues.email}
						margin='normal'
						required
						fullWidth
						error={!!emailValidationMessage}
					/>
					<TextField
						label='password'
						id='password'
						type='password'
						name='password'
						helperText={passwordlValidationMessage}
						onChange={handleChange}
						onBlur={handleBlurPassword}
						margin='normal'
						required
						fullWidth
						error={!!emailValidationMessage}
					/>
					<Button
						disabled={isFetching}
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}>
						Send
					</Button>
				</Box>
				<Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					open={isOpen}
					autoHideDuration={6000}
					onClose={handleClose}
					message={errorMessage}
				/>
			</Box>
		</Container>
	)
}

export default LoginPage
