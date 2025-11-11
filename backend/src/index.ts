import 'dotenv/config'
import express from 'express'
import cors from 'cors'
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

// Procesa múltiples orígenes si vienen separados por comas
const allowedOrigins = CORS_ORIGIN === '*' 
  ? '*' 
  : CORS_ORIGIN.split(',').map(o => o.trim())

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
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


