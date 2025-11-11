import { isValidCURP } from './curp'

export type UserRow = { email?: string; nombre?: string; role?: string; curp?: string; superiorId?: string }

export function validateRow(u: UserRow): string[] {
  const errors: string[] = []
  if (!u.email) errors.push('email requerido')
  if (!u.nombre) errors.push('nombre requerido')
  if (!u.role) errors.push('role requerido')
  if (u.curp && !isValidCURP(u.curp)) errors.push(`CURP inválida (${u.curp})`)
  return errors
}

export function validateBatch(items: UserRow[]) {
  const res = items.map((u, idx) => ({ index: idx, errors: validateRow(u) }))
  const valid = res.filter(r => r.errors.length === 0).length
  const invalid = res.length - valid
  return { summary: { total: res.length, valid, invalid }, details: res }
}
