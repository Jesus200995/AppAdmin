import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
