import { Router } from 'express'
import { isValidCURP } from '../lib/curp'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/curp', authMiddleware, (req, res) => {
  const { curp } = req.body as { curp?: string }
  if (!curp) return res.status(400).json({ ok: false, error: 'curp required' })
  const ok = isValidCURP(curp)
  res.json({ ok })
})

export default router
