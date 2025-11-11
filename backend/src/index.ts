import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import usersAdminRoutes from './routes/users-admin'
import changeSuperiorRoutes from './routes/change-superior'
import validateRoutes from './routes/validate'
import importRoutes from './routes/import'
import metricsRoutes from './routes/metrics'
import mapRoutes from './routes/map'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

// Middleware CORS personalizado (sin librerías externas)
app.use((req, res, next) => {
  const origin = CORS_ORIGIN
  if (origin === '*') {
    res.header('Access-Control-Allow-Origin', '*')
  } else {
    // Si origin tiene múltiples valores, envía el primero que coincida
    const allowedOrigins = origin.split(',').map(o => o.trim())
    const reqOrigin = req.headers.origin
    if (reqOrigin && allowedOrigins.includes(reqOrigin)) {
      res.header('Access-Control-Allow-Origin', reqOrigin)
    }
  }
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin/users', usersAdminRoutes)
app.use('/api/change-superior', changeSuperiorRoutes)
app.use('/api/validate', validateRoutes)
app.use('/api/import', importRoutes)
app.use('/api/metrics', metricsRoutes)
app.use('/api/map', mapRoutes)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})


