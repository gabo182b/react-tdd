import PropTypes from 'prop-types'
import { Typography, Box } from '@mui/material'

export const Content = ({ isSearchApplied, repositoriesList, children }) => {
	const renderWithBox = (element) => (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			height={400}>
			{element}
		</Box>
	)

	if (isSearchApplied && !!repositoriesList.length) {
		return children
	}

	if (isSearchApplied && !repositoriesList.length) {
		return renderWithBox(<Typography>Your search has no results</Typography>)
	}

	return renderWithBox(
		<Typography>
			Please provide a search option and click the search button
		</Typography>
	)
}

export default Content

Content.propTypes = {
	isSearchApplied: PropTypes.bool.isRequired,
	repositoriesList: PropTypes.arrayOf(PropTypes.object),
	children: PropTypes.node.isRequired,
}
