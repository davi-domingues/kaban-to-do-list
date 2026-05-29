import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type AuthContextValue = {
  user: User | null
  userId: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (!ignore) {
        setUser(data.session?.user ?? null)
        setUserId(data.session?.user.id ?? null)
        setLoading(false)
      }
    }

    loadSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      if (!ignore) {
        setUser(session?.user ?? null)
        setUserId(session?.user.id ?? null)
        setLoading(false)
      }
    })

    return () => {
      ignore = true
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({ user, userId, loading }),
    [user, userId, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
