import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button } from '@mui/material'

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true }
	}

	handleReloadClick = () => window.location.reload()

	render() {
		const { children } = this.props
		const { hasError } = this.state

		if (hasError) {
			return (
				<>
					<Typography variant='h4'>There is an unexpected error</Typography>
					<Button
						type='button'
						onClick={this.handleReloadClick}
						variant='container'
						color='primary'>
						Reload
					</Button>
				</>
			)
		}
		return children
	}
}

export default ErrorBoundary

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
}
