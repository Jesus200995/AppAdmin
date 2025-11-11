import { enqueueMutation } from '../offline/queue'

const API_URL = import.meta.env.VITE_API_URL as string

function getToken() {
  return localStorage.getItem('token') || ''
}
export function setToken(t: string) {
  localStorage.setItem('token', t)
}
export function clearToken() {
  localStorage.removeItem('token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = true
): Promise<T> {
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  if (auth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function apiMutate<T>(
  path: string,
  method: 'POST'|'PUT'|'DELETE',
  body: any,
  auth = true
): Promise<T> {
  try {
    return await apiFetch<T>(path, {
      method,
      body: JSON.stringify(body)
    }, auth)
  } catch (e) {
    // Si no hay red, encola
    if (!navigator.onLine) {
      await enqueueMutation({ url: path, method, body })
      // devuelve una respuesta optimista mínima
      return Promise.resolve({} as T)
    }
    throw e
  }
}

export type LoginResponse = {
  token: string
  user: { id: string; email: string; nombre: string; role: string }
}

export async function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, false)
}

export async function meRequest() {
  return apiFetch<{ id: string; email: string; nombre: string; role: string; superiorId?: string }>(
    '/api/users/me'
  )
}

export async function validateCurp(curp: string) {
  return apiFetch<{ ok: boolean }>('/api/validate/curp', {
    method: 'POST',
    body: JSON.stringify({ curp })
  })
}

export async function findByCurp(curp: string) {
  return apiFetch<{ id: string; email: string; nombre: string; role: string; curp: string; superiorId?: string }>(
    `/api/users/by-curp/${encodeURIComponent(curp)}`
  )
}

export async function searchUsers(q: string) {
  return apiFetch<Array<{ id: string; email: string; nombre: string; role: string; curp?: string }>>(
    `/api/users/search?q=${encodeURIComponent(q)}`
  )
}

export async function importUsers(items: any[]) {
  return apiFetch<{ total: number; results: Array<{ ok: boolean; email?: string; error?: string }> }>(
    '/api/import/users',
    { method: 'POST', body: JSON.stringify({ items }) }
  )
}

export async function getOverviewMetrics() {
  return apiFetch<{
    byRole: Record<string, number>,
    pending: number,
    topSup: Array<{ id: string; nombre: string; role: string; _count: { subalternos: number } }>
  }>('/api/metrics/overview')
}

export async function getMapUsers(params: { role?: string; superiorId?: string }) {
  const q = new URLSearchParams()
  if (params.role) q.set('role', params.role)
  if (params.superiorId) q.set('superiorId', params.superiorId)
  return apiFetch<Array<{ id: string; nombre: string; email: string; role: string; superiorId?: string }>>(
    `/api/map/users?${q.toString()}`
  )
}
