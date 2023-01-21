import { OK_STATUS } from '../consts'
import { getRepositoriesPerPage, makeFakeResponse } from './repos'
// Mock
export const handlerPaginated = (req, res, ctx) =>
	res(
		ctx.status(OK_STATUS),
		ctx.json({
			...makeFakeResponse({ totalCount: 1000 }),
			items: getRepositoriesPerPage({
				currentPage: req.url.searchParams.get('page'),
				perPage: Number(req.url.searchParams.get('per_page')),
			}),
		})
	)

export default {
	handlerPaginated,
}
