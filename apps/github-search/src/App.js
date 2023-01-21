import { GithubSearchPage } from './components/GithubSearchPage'
import { ErrorBoundary } from './components/errorBoundary'

function App() {
	return (
		<ErrorBoundary>
			<GithubSearchPage />
		</ErrorBoundary>
	)
}

export default App
