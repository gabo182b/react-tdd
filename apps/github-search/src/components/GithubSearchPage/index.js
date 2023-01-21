import { useEffect, useState, useRef, useCallback } from 'react'
import {
	Typography,
	TextField,
	Button,
	Container,
	Grid,
	Box,
	TablePagination,
	Snackbar,
} from '@mui/material'
// import Snackbar from '@mui/material/Snackbar';
import { Content } from '../Content'
import { GithubTable } from '../GithubTable'
import { getRepositories } from '../../services'

const ROWS_PER_PAGE_DEFAULT = 30
const INITIAL_CURRENT_PAGE = 0
const INITIAL_TOTAL_COUNT = 0

export const GithubSearchPage = () => {
	const [isSearching, setIsSearching] = useState(false)
	const [isSearchApplied, setIsSearchApplied] = useState(false)
	const [repositoriesList, setRrepositoriesList] = useState([])
	const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT)
	const [currentPage, setCurrentPage] = useState(INITIAL_CURRENT_PAGE)
	const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)
	const [isOpen, setIsOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const didMount = useRef(false)
	const searchByInput = useRef(null)

	const handleSearch = useCallback(async () => {
		try {
			setIsSearching(true)
			// await Promise.resolve()
			const response = await getRepositories({
				q: searchByInput.current.value,
				rowsPerPage,
				currentPage,
			})
			if (!response.ok) {
				throw response
			}
			const data = await response.json()
			setRrepositoriesList(data.items)
			setTotalCount(data.total_count)
			setIsSearchApplied(true)
			setIsSearching(false)
		} catch (error) {
			const data = await error.json()
			setIsOpen(true)
			setErrorMessage(data.message)
		} finally {
			setIsSearching(false)
		}
	}, [rowsPerPage, currentPage])

	const handleChangeRowsPerPage = (event) => {
		setCurrentPage(INITIAL_CURRENT_PAGE)
		setRowsPerPage(event.target.value)
	}

	const handleChangePage = (event, newPage) => {
		setCurrentPage(newPage)
	}

	const handleClickSearch = () => {
		if (currentPage === INITIAL_CURRENT_PAGE) {
			handleSearch()
			return
		}
		setCurrentPage(INITIAL_CURRENT_PAGE)
	}

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}
		handleSearch()
	}, [handleSearch])

	return (
		<Container>
			<Box my={4}>
				<Typography variant='h3' component='h3'>
					github repositories list
				</Typography>
			</Box>
			<Grid container spacing={2} justifyContent='space-between'>
				<Grid item md={6} xs={12}>
					<TextField
						inputRef={searchByInput}
						fullWidth
						label='Filter by'
						id='filterby'
						variant='standard'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<Button
						disabled={isSearching}
						fullWidth
						color='primary'
						variant='container'
						onClick={handleClickSearch}>
						Search
					</Button>
				</Grid>
			</Grid>
			<Box my={4}>
				<Content
					isSearchApplied={isSearchApplied}
					repositoriesList={repositoriesList}>
					<>
						<GithubTable repositoriesList={repositoriesList} />
						<TablePagination
							rowsPerPageOptions={[30, 50, 100]}
							component='div'
							count={totalCount}
							rowsPerPage={rowsPerPage}
							page={currentPage}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</>
				</Content>
			</Box>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={isOpen}
				autoHideDuration={6000}
				onClose={() => setIsOpen(false)}
				message={errorMessage}
			/>
		</Container>
	)
}

export default GithubSearchPage
