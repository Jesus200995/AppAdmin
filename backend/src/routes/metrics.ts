import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const prisma = new PrismaClient() as any
const router = Router()

router.get('/overview', authMiddleware, async (_req, res) => {
  try {
    // Conteo por rol
    const byRoleRaw = await prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true }
    })
    const byRole = Object.fromEntries(byRoleRaw.map((r: any) => [r.role, r._count._all]))

    // Solicitudes pendientes
    const pending = await prisma.changeSuperiorRequest.count({
      where: { status: 'PENDING' }
    })

    // Top 10 superiores con más subalternos
    const topSup = await prisma.user.findMany({
      where: { subalternos: { some: {} } },
      select: { id: true, nombre: true, role: true, _count: { select: { subalternos: true } } },
      orderBy: { subalternos: { _count: 'desc' } },
      take: 10
    }) as any

    res.json({ byRole, pending, topSup })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
