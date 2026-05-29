import { AuthProvider } from './auth/AuthProvider'
import AuthGate from './auth/AuthGate'
import BoardsPage from './features/boards/BoardsPage'

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <BoardsPage />
      </AuthGate>
    </AuthProvider>
  )
}

export default App
