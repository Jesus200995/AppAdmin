import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import { getRequiredApproverRole } from '../lib/approval'

const prisma = new PrismaClient() as any
const router = Router()

// Crear solicitud
router.post('/', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string; role: Role }
  const { newSuperiorId, reason } = req.body as { newSuperiorId: string; reason?: string }

  const requester = await prisma.user.findUnique({ where: { id: auth.userId } })
  const approverRole = getRequiredApproverRole(requester!.role)

  // Buscar un usuario del rol que aprueba dentro de la jerarquía actual (simplificado: el superior actual)
  const approverId = requester?.superiorId || undefined

  const reqCreated = await prisma.changeSuperiorRequest.create({
    data: {
      requesterId: auth.userId,
      newSuperiorId,
      approverId: approverId || null,
      reason: reason || null
    }
  })

  await prisma.actionLog.create({
    data: {
      actorId: auth.userId, entity: 'ChangeSuperiorRequest', entityId: reqCreated.id,
      action: 'REQUEST_CHANGE_SUPERIOR', details: JSON.stringify({ newSuperiorId, reason })
    }
  })

  res.status(201).json(reqCreated)
})

// Listar mis solicitudes
router.get('/mine', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string }
  const list = await prisma.changeSuperiorRequest.findMany({
    where: { requesterId: auth.userId },
    orderBy: { createdAt: 'desc' }
  })
  res.json(list)
})

// Listar solicitudes que debo aprobar
router.get('/to-approve', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string }
  const list = await prisma.changeSuperiorRequest.findMany({
    where: { approverId: auth.userId, status: 'PENDING' },
    include: { requester: { select: { id: true, nombre: true, role: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(list)
})

// Aprobar
router.post('/:id/approve', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string; role: Role }
  const { id } = req.params as { id: string }

  const csr = await prisma.changeSuperiorRequest.findUnique({ where: { id } })
  if (!csr) return res.status(404).json({ error: 'not found' })
  if (csr.status !== 'PENDING') return res.status(400).json({ error: 'already decided' })
  if (csr.approverId && csr.approverId !== auth.userId) return res.status(403).json({ error: 'not approver' })

  // cambia superior del solicitante
  await prisma.user.update({ where: { id: csr.requesterId }, data: { superiorId: csr.newSuperiorId } })
  const updated = await prisma.changeSuperiorRequest.update({
    where: { id },
    data: { status: 'APPROVED', decidedById: auth.userId }
  })

  await prisma.actionLog.create({
    data: {
      actorId: auth.userId, entity: 'ChangeSuperiorRequest', entityId: id,
      action: 'APPROVE', details: JSON.stringify({ requesterId: csr.requesterId, newSuperiorId: csr.newSuperiorId })
    }
  })

  res.json(updated)
})

// Rechazar
router.post('/:id/reject', authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { userId: string; role: Role }
  const { id } = req.params as { id: string }
  const { reason } = req.body as { reason?: string }

  const csr = await prisma.changeSuperiorRequest.findUnique({ where: { id } })
  if (!csr) return res.status(404).json({ error: 'not found' })
  if (csr.status !== 'PENDING') return res.status(400).json({ error: 'already decided' })
  if (csr.approverId && csr.approverId !== auth.userId) return res.status(403).json({ error: 'not approver' })

  const updated = await prisma.changeSuperiorRequest.update({
    where: { id },
    data: { status: 'REJECTED', decidedById: auth.userId, reason: reason || null }
  })

  await prisma.actionLog.create({
    data: {
      actorId: auth.userId, entity: 'ChangeSuperiorRequest', entityId: id,
      action: 'REJECT', details: JSON.stringify({ reason })
    }
  })

  res.json(updated)
})

export default router
