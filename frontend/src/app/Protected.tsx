import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

export default function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />
  return children
}
