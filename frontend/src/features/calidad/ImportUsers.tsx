import { useState } from 'react'
import { importUsers } from '../../app/api'
import { validateBatch } from './rules'

export default function ImportUsers() {
  const [json, setJson] = useState('')
  const [validated, setValidated] = useState<any | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onValidate() {
    setError(null); setResults(null)
    try {
      const items = JSON.parse(json)
      if (!Array.isArray(items)) throw new Error('El JSON debe ser un array')
      const report = validateBatch(items)
      setValidated(report)
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function onImport() {
    if (!validated) return
    setLoading(true); setError(null)
    try {
      const items = JSON.parse(json)
      const res = await importUsers(items)
      setResults(res)
    } catch (e: any) {
      setError('Error en la importación: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <h3>Importar Usuarios por JSON</h3>
      <textarea
        value={json}
        onChange={e => setJson(e.target.value)}
        placeholder='[{"email":"user@local","nombre":"Nombre","role":"TECNICO_PROD","curp":"AAAA000101HDFLLL01"}]'
        rows={6}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onValidate}>Validar</button>
        <button onClick={onImport} disabled={!validated || loading}>
          {loading ? 'Importando…' : 'Importar'}
        </button>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {validated && (
        <div style={{ padding: 12, backgroundColor: '#f0fdf4', borderRadius: 8 }}>
          <b>Validación:</b> {validated.summary.valid}/{validated.summary.total} OK
          {validated.summary.invalid > 0 && (
            <div style={{ marginTop: 8, fontSize: 12 }}>
              {validated.details.filter((d: any) => d.errors.length > 0).map((d: any) => (
                <div key={d.index} style={{ color: 'crimson' }}>
                  Fila {d.index}: {d.errors.join('; ')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {results && (
        <div style={{ padding: 12, backgroundColor: '#f0f9ff', borderRadius: 8 }}>
          <b>Importación:</b> {results.results.filter((r: any) => r.ok).length}/{results.total} exitosa
          {results.results.filter((r: any) => !r.ok).length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12 }}>
              {results.results.filter((r: any) => !r.ok).map((r: any, idx: number) => (
                <div key={idx} style={{ color: 'orange' }}>
                  {r.email}: {r.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
