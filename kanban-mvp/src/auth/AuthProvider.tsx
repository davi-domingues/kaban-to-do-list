import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type AuthContextValue = {
  userId: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (!ignore) {
        setUserId(data.session?.user.id ?? null)
        setLoading(false)
      }
    }

    loadSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      if (!ignore) {
        setUserId(session?.user.id ?? null)
        setLoading(false)
      }
    })

    return () => {
      ignore = true
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ userId, loading }), [userId, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
