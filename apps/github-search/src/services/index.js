const baseUrl =
	process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL

export const getRepositories = ({ q, rowsPerPage, currentPage }) =>
	// fetch(`${baseUrl}/search/repositories?q=${q}&page=0&per_page=${rowsPerPage}`)
	fetch(
		`${baseUrl}/search/repositories?q=${q}&page=${currentPage}&per_page=${rowsPerPage}`
	)

export default {
	getRepositories,
}
