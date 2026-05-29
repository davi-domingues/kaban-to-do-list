import { useAuth } from './AuthProvider'
import LoginForm from './LoginForm'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { userId, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading">Carregando...</div>
  }

  if (!userId) {
    return <LoginForm />
  }

  return <>{children}</>
}
