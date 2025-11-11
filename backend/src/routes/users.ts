import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import { isValidCURP } from '../lib/curp'

const prisma = new PrismaClient() as any
const router = Router()

router.get('/me', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string }
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, nombre: true, role: true, superiorId: true }
  })
  if (!user) return res.status(404).json({ error: 'not found' })
  res.json(user)
})

router.get('/by-curp/:curp', authMiddleware, async (req, res) => {
  const curp = String(req.params.curp || '').toUpperCase()
  if (!isValidCURP(curp)) return res.status(400).json({ error: 'CURP inválida' })

  const user = await prisma.user.findUnique({
    where: { curp },
    select: { id: true, email: true, nombre: true, role: true, superiorId: true, curp: true }
  })
  if (!user) return res.status(404).json({ error: 'No encontrado' })
  res.json(user)
})

router.get('/search', authMiddleware, async (req, res) => {
  const q = String(req.query.q || '').trim()
  if (!q) return res.status(400).json({ error: 'q required' })

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { curp: { startsWith: q.toUpperCase() } },
        { nombre: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 20,
    select: { id: true, email: true, nombre: true, role: true, curp: true }
  })
  res.json(users)
})

export default router
