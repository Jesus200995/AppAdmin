import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { authMiddleware } from '../middleware/auth'
import { isValidCURP } from '../lib/curp'

const prisma = new PrismaClient() as any
const router = Router()

type RawUser = {
  email: string
  nombre: string
  password?: string
  role: Role
  curp?: string
  superiorId?: string
}

router.post('/users', authMiddleware, async (req, res) => {
  const items = (req.body?.items || []) as RawUser[]
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items required' })
  }

  const results: Array<{ ok: boolean; email?: string; error?: string }> = []
  for (const it of items) {
    try {
      if (!it.email || !it.nombre || !it.role) throw new Error('faltan campos: email/nombre/role')
      if (it.curp && !isValidCURP(it.curp)) throw new Error(`CURP inválida: ${it.curp}`)

      const hash = await bcrypt.hash(it.password || 'Cambio123*', 10)
      await prisma.user.create({
        data: {
          email: it.email,
          nombre: it.nombre,
          passwordHash: hash,
          role: it.role,
          curp: it.curp?.toUpperCase(),
          superiorId: it.superiorId || null,
        }
      })
      results.push({ ok: true, email: it.email })
    } catch (e: any) {
      results.push({ ok: false, email: it.email, error: e.message })
    }
  }
  res.json({ total: items.length, results })
})

export default router
