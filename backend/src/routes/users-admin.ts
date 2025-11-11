import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient() as any
const router = Router()

// Crear usuario subordinado (ej: FACILITADOR crea TECNICO, TERRITORIAL crea FACILITADOR, etc.)
router.post('/', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string; role: Role }
  const { email, nombre, password, role, superiorId } = req.body as {
    email: string; nombre: string; password: string; role: Role; superiorId?: string
  }

  // reglas simples de jerarquía
  const allowedMap: Record<Role, Role[]> = {
    ADMIN: ['COORD_TERRITORIAL', 'TERRITORIAL', 'FACILITADOR', 'TECNICO_PROD', 'TECNICO_SOC', 'ADMIN'],
    COORD_TERRITORIAL: ['TERRITORIAL', 'FACILITADOR', 'TECNICO_PROD', 'TECNICO_SOC'],
    TERRITORIAL: ['FACILITADOR', 'TECNICO_PROD', 'TECNICO_SOC'],
    FACILITADOR: ['TECNICO_PROD', 'TECNICO_SOC'],
    TECNICO_PROD: [],
    TECNICO_SOC: [],
  }

  const canCreate = allowedMap[auth.role]?.includes(role)
  if (!canCreate) return res.status(403).json({ error: 'No autorizado para crear este rol' })

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email, nombre, passwordHash: hash, role,
      superiorId: superiorId ?? auth.userId
    },
    select: { id: true, email: true, nombre: true, role: true, superiorId: true }
  })

  // log
  await prisma.actionLog.create({
    data: { actorId: auth.userId, entity: 'User', entityId: user.id, action: 'CREATE_USER', details: JSON.stringify({ role }) }
  })

  res.status(201).json(user)
})

export default router
