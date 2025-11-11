import { useState } from 'react'
import { apiMutate } from '../app/api'
import { useAuth } from '../app/auth'

export default function AdminTools() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [pass, setPass] = useState('abc12345')
  const [role, setRole] = useState('TECNICO_PROD')
  const [newSup, setNewSup] = useState('')

  if (!user) return null

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div>
        <h3>Crear usuario (subordinado)</h3>
        <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
          <input placeholder="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option>TECNICO_PROD</option>
            <option>TECNICO_SOC</option>
            <option>FACILITADOR</option>
            <option>TERRITORIAL</option>
          </select>
          <button onClick={async ()=>{
            try {
              await (apiMutate as any)('/api/admin/users','POST',{ email, nombre, password: pass, role })
              alert('Usuario creado (o encolado si estabas offline)')
              setEmail('')
              setNombre('')
            } catch (e: any) {
              alert('Error: ' + e.message)
            }
          }}>Crear</button>
        </div>
      </div>

      <div>
        <h3>Solicitar cambio de superior</h3>
        <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <input placeholder="nuevo superiorId" value={newSup} onChange={e=>setNewSup(e.target.value)} />
          <button onClick={async ()=>{
            try {
              await (apiMutate as any)('/api/change-superior','POST',{ newSuperiorId: newSup, reason: 'reubicación' })
              alert('Solicitud enviada (offline -> en cola)')
              setNewSup('')
            } catch (e: any) {
              alert('Error: ' + e.message)
            }
          }}>Solicitar</button>
        </div>
      </div>
    </section>
  )
}
