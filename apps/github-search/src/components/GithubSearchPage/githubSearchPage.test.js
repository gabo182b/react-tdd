import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react'
import { GithubSearchPage } from './'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
	getRepositoriesListBy,
	makeFakeRepository,
	makeFakeResponse,
	makeFakeError,
} from '../../__fixtures__/repos'
import {
	OK_STATUS,
	UNEXPECTED_STATUS,
	UNPROCESSABLE_STATUS,
} from '../../consts'
const fakeResponse = makeFakeResponse({ totalCount: 1 })

const fakeRepository = makeFakeRepository()

fakeResponse.items = [fakeRepository]

const server = setupServer(
	rest.get('/search/repositories', (req, res, ctx) =>
		res(ctx.status(OK_STATUS), ctx.json(fakeResponse))
	)
)
// Enable API mocking before tests.
beforeAll(() => server.listen())
// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())
// Disable API mocking after the tests are done.
afterAll(() => server.close())

beforeEach(() => render(<GithubSearchPage />))

const fireSearchButton = () =>
	fireEvent.click(screen.getByRole('button', { name: /search/i }))

describe('when the GithubSearchPage is mounted', () => {
	it('must display the title', () => {
		expect(
			screen.getByRole('heading', { name: /github repositories list/i })
		).toBeInTheDocument()
	})

	it('must be an input text with label "filter by"', () => {
		expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
	})

	it('must be a Search Button', () => {
		expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
	})

	it('must be an initial message that shows "Please provide a search option and click the search button"', () => {
		expect(
			screen.getByText(
				/please provide a search option and click the search button/i
			)
		).toBeInTheDocument()
	})
})

describe('when the user does a search', () => {
	it('The search button should be disabled until the search is done', async () => {
		const searchButton = screen.getByRole('button', { name: /search/i })
		expect(searchButton).not.toBeDisabled()

		fireEvent.change(screen.getByLabelText(/filter by/i), {
			target: { value: 'test' },
		})

		expect(searchButton).not.toBeDisabled()

		fireSearchButton()

		expect(searchButton).toBeDisabled()

		await waitFor(() => expect(searchButton).not.toBeDisabled())
	})

	it('the data should be displayed as a sticky table', async () => {
		fireSearchButton()

		await waitFor(() =>
			expect(
				screen.queryByText(
					/please provide a search option and click the search button/i
				)
			).not.toBeInTheDocument()
		)

		expect(screen.getByRole('table')).toBeInTheDocument()
	})

	it('the table headers must contain: Repository, stars, forks, open issues and updated at', async () => {
		fireSearchButton()
		// every query which start with "find" returns a promise
		const table = await screen.findByRole('table')

		const tableHeaders = within(table).getAllByRole('columnheader')

		expect(tableHeaders).toHaveLength(5)

		const [repository, stars, forks, openIssues, updatedAt] = tableHeaders

		expect(repository).toHaveTextContent(/repository/i)
		expect(stars).toHaveTextContent(/stars/i)
		expect(forks).toHaveTextContent(/forks/i)
		expect(openIssues).toHaveTextContent(/open issues/i)
		expect(updatedAt).toHaveTextContent(/updated at/i)
	})

	it(`each table result should have: owner avatar image, name, stars, updated at, forks, open issues, 
		it should have a link that opens in a new tab the clicked github repository `, async () => {
		fireSearchButton()
		const table = await screen.findByRole('table')

		const withinTable = within(table)

		const tableCells = withinTable.getAllByRole('cell')

		const [repository, stars, forks, openIssues, updatedAt] = tableCells

		const avatarImg = within(repository).getByRole('img', {
			name: fakeRepository.name,
		})
		expect(avatarImg).toBeInTheDocument()
		expect(tableCells).toHaveLength(5)
		expect(repository).toHaveTextContent(fakeRepository.name)
		expect(stars).toHaveTextContent(fakeRepository.stargazers_count)
		expect(forks).toHaveTextContent(fakeRepository.forks_count)
		expect(openIssues).toHaveTextContent(fakeRepository.open_issues_count)
		expect(updatedAt).toHaveTextContent(fakeRepository.updated_at)

		expect(
			withinTable.getByText(fakeRepository.name).closest('a')
		).toHaveAttribute('href', fakeRepository.html_url)

		expect(avatarImg).toHaveAttribute('src', fakeRepository.owner.avatar_url)
	})

	it('must display the total results number of the search and the current number of results', async () => {
		fireSearchButton()

		await screen.findByRole('table')

		expect(screen.getByText(/1–1 of 1/i)).toBeInTheDocument()
	})

	it('results size per page select/combobox with the options: 30, 50, 100. The default is 30', async () => {
		fireSearchButton()

		await screen.findByRole('table')

		expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()

		fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
		// getAllByRole returns an array
		const listbox = screen.getByRole('listbox', { name: /rows per page/i })

		const options = within(listbox).getAllByRole('option')

		const [option30, option50, option100] = options

		expect(option30).toHaveTextContent(/30/i)
		expect(option50).toHaveTextContent(/50/i)
		expect(option100).toHaveTextContent(/100/i)
	})

	it('must exists a next and previous pagination buttons', async () => {
		fireSearchButton()

		await screen.findByRole('table')

		const previousPageButton = screen.getByRole('button', {
			name: /go to previous page/i,
		})

		expect(previousPageButton).toBeInTheDocument()

		expect(
			screen.getByRole('button', { name: /go to next page/i })
		).toBeInTheDocument()

		expect(previousPageButton).toBeDisabled()
	})
})

describe('when the developer does a search without results', () => {
	it('must show an empty state message "Your search has no results"', async () => {
		// set the mock server to return no items
		server.use(
			rest.get('/search/repositories', (req, res, ctx) =>
				res(ctx.status(OK_STATUS), ctx.json(makeFakeResponse({})))
			)
		)
		// click search
		fireSearchButton()
		// expect no result message
		await waitFor(() => expect(screen.getByText(/your search has no results/i)))
		// expect table not found
		expect(screen.queryByRole('table')).not.toBeInTheDocument()
	})
})

describe('when the developer types on filter by an does a search', () => {
	it('must display the related repos', async () => {
		// setup the mock server
		const internalFakeResponse = makeFakeResponse()
		const REPO_NAME = 'laravel'
		const expectedRepo = getRepositoriesListBy({ name: REPO_NAME })[0]
		server.use(
			rest.get('/search/repositories', (req, res, ctx) =>
				res(
					ctx.status(OK_STATUS),
					ctx.json({
						...internalFakeResponse,
						items: getRepositoriesListBy({
							name: req.url.searchParams.get('q'),
						}),
					})
				)
			)
		)
		// type for a word in filter by input
		fireEvent.change(screen.getByLabelText(/filter by/i), {
			target: { value: REPO_NAME },
		})
		// click on search
		fireSearchButton()
		const table = await screen.findByRole('table')
		// expect the table content
		expect(table).toBeInTheDocument()
		const withinTable = within(table)
		const tableCells = withinTable.getAllByRole('cell')
		const [repository] = tableCells
		expect(repository).toHaveTextContent(expectedRepo.name)
	})
})

describe('when there is an unprocessable entity from the backend', () => {
	it('must display an alert message error with the message from the service', async () => {
		expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument()
		// configure server to return an error
		server.use(
			rest.get('/search/repositories', (req, res, ctx) =>
				res(ctx.status(UNPROCESSABLE_STATUS), ctx.json(makeFakeError()))
			)
		)
		// click search
		fireSearchButton()
		// expect message
		// findByRole returns a promise
		expect(await screen.findByText(/validation failed/i)).toBeVisible()
	})
})

describe('when there is an unexpected error from the backend', () => {
	it('must display an alert message error with the message from the service', async () => {
		expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument()
		// configure server to return an error
		server.use(
			rest.get('/search/repositories', (req, res, ctx) =>
				res(
					ctx.status(UNEXPECTED_STATUS),
					ctx.json(makeFakeError({ message: 'Unexpected Error' }))
				)
			)
		)
		// click search
		fireSearchButton()
		// expect message
		// findByRole returns a promise
		expect(await screen.findByText(/unexpected error/i)).toBeVisible()
	})
})
