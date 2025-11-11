import { useState } from 'react'
import { findByCurp } from '../../app/api'
import { isValidCURP } from './curp'

export default function BuscarCURP() {
  const [curp, setCurp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setResult(null)
    const c = curp.trim().toUpperCase()
    if (!isValidCURP(c)) { setError('CURP inválida'); return }
    setLoading(true)
    try {
      const r = await findByCurp(c)
      setResult(r)
    } catch (e: any) {
      setError('No encontrado o error de servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h3>Búsqueda por CURP</h3>
      <form onSubmit={onSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          value={curp}
          onChange={e=>setCurp(e.target.value)}
          placeholder="Ingresa CURP (18)"
          style={{ flex: 1 }}
          maxLength={18}
        />
        <button disabled={loading}>{loading ? 'Buscando…' : 'Buscar'}</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {result && (
        <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
          <div><b>Nombre:</b> {result.nombre}</div>
          <div><b>Email:</b> {result.email}</div>
          <div><b>Rol:</b> {result.role}</div>
          <div><b>CURP:</b> {result.curp}</div>
          <div><b>SuperiorId:</b> {result.superiorId ?? '—'}</div>
        </div>
      )}
    </section>
  )
}
