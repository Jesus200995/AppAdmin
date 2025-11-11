import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const prisma = new PrismaClient()
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

export default router
