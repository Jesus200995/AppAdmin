import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: llamar a backend /api/auth/login y guardar token
    nav('/')
  }
  return (
    <section style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handle} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
    </section>
  )
}
