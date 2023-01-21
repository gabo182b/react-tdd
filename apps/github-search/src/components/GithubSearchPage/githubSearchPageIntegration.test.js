import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { GithubSearchPage } from './'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { makeFakeRepository, makeFakeResponse } from '../../__fixtures__/repos'
import { OK_STATUS } from '../../consts'
import { handlerPaginated } from '../../__fixtures__/handlers'

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

describe('when the user does a search and selects 50 rows per page', () => {
	it('must fetch a new search displaying a 50 rows result on the table', async () => {
		// setup the mock server response
		server.use(rest.get('/search/repositories', handlerPaginated))
		// click search
		fireSearchButton()
		// expect 30 rows length
		expect(await screen.findByRole('table')).toBeInTheDocument()
		// everything that has the word "All" works when you have more than one node of the same type
		// the header is counted as a row, it must be counted in the length
		expect(await screen.findAllByRole('row')).toHaveLength(31)
		// select 50 per page
		fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
		fireEvent.click(screen.getByRole('option', { name: '50' }))
		// expect 50 rows length
		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)
		expect(screen.getAllByRole('row')).toHaveLength(51)
	})
})

describe('when the user clicks on search and then clicks on next page button and then on previous page button', () => {
	it('must display the next repositories page', async () => {
		// setup the mock server handler
		server.use(rest.get('/search/repositories', handlerPaginated))
		// click search
		fireSearchButton()
		// expect table in screen
		expect(await screen.findByRole('table')).toBeInTheDocument()
		// expext first repo name from page 0
		expect(screen.getByRole('cell', { name: /1-0/i })).toBeInTheDocument()
		// expect that the next page button is not disabled
		expect(
			screen.getByRole('button', { name: /go to next page/i })
		).not.toBeDisabled()
		// click next page button
		fireEvent.click(screen.getByRole('button', { name: /go to next page/i }))
		// wait search button is not diabled
		expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()
		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)
		// expect first repo name from page 1
		expect(screen.getByRole('cell', { name: /2-0/i })).toBeInTheDocument()
		// click previous page
		fireEvent.click(
			screen.getByRole('button', { name: /go to previous page/i })
		)
		// wait for the search to finish
		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)
		// expect
		expect(screen.getByRole('cell', { name: /1-0/i })).toBeInTheDocument()
	})
})

describe('when the user does a search and clicks the next page button and selects 50 rows per page', () => {
	it('must display the results of the first page', async () => {
		// setup the mock server handler
		server.use(rest.get('/search/repositories', handlerPaginated))
		// click search
		fireSearchButton()
		// expect table in screen
		expect(await screen.findByRole('table')).toBeInTheDocument()
		// expext first repo name from page 0
		expect(screen.getByRole('cell', { name: /1-0/i })).toBeInTheDocument()
		// expect that the next page button is not disabled
		expect(
			screen.getByRole('button', { name: /go to next page/i })
		).not.toBeDisabled()
		// click next page button
		fireEvent.click(screen.getByRole('button', { name: /go to next page/i }))
		// wait search button is not diabled
		expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()
		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)
		// expect first repo name from page 1
		expect(screen.getByRole('cell', { name: /2-0/i })).toBeInTheDocument()
		// select 50 per page
		fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
		fireEvent.click(screen.getByRole('option', { name: '50' }))
		// expect 50 rows length
		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)
		// expect to be in the first page
		expect(screen.getByRole('cell', { name: /1-0/i })).toBeInTheDocument()
	})
})

describe('when the user does a search and clicks the next page button and clicks on search again', () => {
	it('must display the results of the first page', async () => {
		server.use(rest.get('/search/repositories', handlerPaginated))

		fireSearchButton()

		expect(await screen.findByRole('table')).toBeInTheDocument()

		expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

		expect(
			screen.getByRole('button', { name: /go to next page/i })
		).not.toBeDisabled()

		fireEvent.click(screen.getByRole('button', { name: /go to next page/i }))

		expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)

		expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

		fireSearchButton()

		await waitFor(
			() =>
				expect(
					screen.getByRole('button', { name: /search/i })
				).not.toBeDisabled(),
			{ timeout: 3000 }
		)

		expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
	})
})
