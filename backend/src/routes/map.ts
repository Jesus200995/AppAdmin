import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const prisma = new PrismaClient() as any
const router = Router()

// GET /api/map/users?role=FACILITADOR&superiorId=xyz
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const role = req.query.role as string | undefined
    const superiorId = req.query.superiorId as string | undefined

    const where: any = {}
    if (role) where.role = role
    if (superiorId) where.superiorId = superiorId

    const list = await prisma.user.findMany({
      where,
      select: { id: true, nombre: true, email: true, role: true, superiorId: true }
    })

    res.json(list)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
