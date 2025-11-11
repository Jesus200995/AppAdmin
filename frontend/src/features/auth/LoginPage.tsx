import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/auth'

export default function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation() as any
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@local')
  const [pass, setPass] = useState('admin123')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = loc.state?.from?.pathname || '/'

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await login(email, pass)
      nav(from, { replace: true })
    } catch (e: any) {
      setErr('Credenciales inválidas o servidor no disponible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handle} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </form>
    </section>
  )
}

