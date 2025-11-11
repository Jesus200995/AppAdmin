# 🔗 CONECTAR FRONTEND + BACKEND

## 📋 Resumen

- **Frontend:** `http://localhost:5173` (desarrollo local)
- **Backend:** `http://31.97.8.51:3000` (VPS)

---

## PASO 1: Actualizar frontend/.env.local

En `frontend/.env.local`, agrega:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoibWFyaWVsMDgiLCJhIjoiY202emV3MDhhMDN6YjJscHVqaXExdGpjMyJ9.F_ACoKzS_4e280lD0XndEw
VITE_API_URL=http://31.97.8.51:3000
```

---

## PASO 2: Crear servicio de API en el frontend

Crea archivo: `frontend/src/app/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json() as Promise<{ token: string; user: any }>
  },

  // Users endpoints
  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Get me failed')
    return res.json()
  },

  // Health check
  health: async () => {
    const res = await fetch(`${API_URL}/api/health`)
    return res.json()
  }
}
```

---

## PASO 3: Crear context de autenticación

Crea archivo: `frontend/src/app/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

interface AuthContextType {
  token: string | null
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Obtener usuario al cargar si tenemos token
  useEffect(() => {
    if (token) {
      setIsLoading(true)
      api.getMe(token)
        .then(setUser)
        .catch(() => {
          setToken(null)
          localStorage.removeItem('auth_token')
        })
        .finally(() => setIsLoading(false))
    }
  }, [token])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { token: newToken, user: newUser } = await api.login(email, password)
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('auth_token', newToken)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
```

---

## PASO 4: Actualizar main.tsx con AuthProvider

Abre: `frontend/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './app/AuthContext'
import { router } from './app/router'
import { queryClient } from './app/queryClient'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

---

## PASO 5: Actualizar LoginPage para usar contexto

Abre: `frontend/src/features/auth/LoginPage.tsx`

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'

export default function LoginPage() {
  const nav = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, pass)
      nav('/')
    } catch (err) {
      setError('Login fallido. Verifica credenciales.')
    }
  }

  return (
    <section style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handle} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
```

---

## PASO 6: Proteger rutas con Auth

Actualiza: `frontend/src/app/router.tsx`

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../ui/AppLayout'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../ui/DashboardPage'
import MapaPage from '../features/mapa/MapaPage'

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token')
  return token ? children : <Navigate to="/login" />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'mapa', element: <MapaPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
])
```

---

## PASO 7: Probar la conexión

1. **Inicia backend:**
```bash
cd backend
npm run dev
```

2. **Inicia frontend:**
```bash
cd frontend
npm run dev
```

3. **Abre navegador:** `http://localhost:5173`

4. **Prueba login:**
   - Email: `admin@local`
   - Password: `admin123`

5. **Verifica en DevTools:**
   - Network tab: peticiones a `/api/auth/login`
   - Storage: token guardado en localStorage
   - Console: sin errores CORS

---

## 🆘 Troubleshooting CORS

### Error: "Access to XMLHttpRequest blocked by CORS policy"

**En backend (`src/index.ts`):**

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',  // Dev local
    'http://localhost:3000',  // Si cambias puerto
    'https://tu-dominio.com'  // Producción
  ],
  credentials: true
}))
```

### En archivo `.env` del backend:

```env
CORS_ORIGIN="http://localhost:5173"
```

---

## 📊 Flujo de autenticación

```
1. Usuario escribe email/password
2. Frontend envia POST /api/auth/login
3. Backend verifica credenciales
4. Backend genera JWT token
5. Frontend recibe token y lo guarda en localStorage
6. Frontend include token en Authorization header
7. Backend valida token en cada petición
```

---

## 🔒 Guardar datos en localStorage (seguro)

En `AuthContext.tsx`, ya se guarda el token:

```typescript
localStorage.setItem('auth_token', newToken)
```

Y se recupera al recargar:

```typescript
const [token, setToken] = useState<string | null>(() => 
  localStorage.getItem('auth_token')
)
```

---

## 📱 En Producción

Cambia URLs en `frontend/.env.local`:

```env
VITE_API_URL=https://api.tu-dominio.com
```

---

**¡Frontend y Backend conectados! 🎉**

Ahora puedes:
- ✅ Hacer login
- ✅ Acceder a dashboard protegido
- ✅ Ver datos del usuario
- ✅ Hacer logout

Próximo: Agregar más endpoints en el backend según necesites.
