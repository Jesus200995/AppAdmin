import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, meRequest, setToken, clearToken } from './api'

type User = { id: string; email: string; nombre: string; role: string }
type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshMe() {
    try {
      const me = await meRequest()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // si hay token en localStorage, intenta cargar /me
    const has = localStorage.getItem('token')
    if (has) {
      refreshMe()
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const { token, user } = await loginRequest(email, password)
      setToken(token)
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, logout, refreshMe }), [user, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
