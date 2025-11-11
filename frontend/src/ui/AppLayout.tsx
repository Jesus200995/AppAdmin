import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function AppLayout() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ minHeight: '100dvh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => setOpen(o => !o)} aria-label="menu">☰</button>
        <Link to="/" style={{ fontWeight: 700 }}>Admin</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => nav('/login')}>Salir</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: open ? '220px 1fr' : '0 1fr', transition: 'grid-template-columns .2s ease' }}>
        <nav style={{ padding: open ? 12 : 0, overflow: 'hidden', borderRight: open ? '1px solid #e5e7eb' : 'none' }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
            <li><NavLink to="/" end>Dashboard</NavLink></li>
            <li><NavLink to="/mapa">Mapa</NavLink></li>
          </ul>
        </nav>
        <main style={{ padding: 12 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
