import { AppRouter } from './AppRouter'
import { AuthGuard } from './utils/components/AuthGuard'

function App() {
	return (
		<AuthGuard>
			<AppRouter />
		</AuthGuard>
	)
}

export default App
