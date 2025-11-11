import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  role: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
  const token = header.substring(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
    ;(req as any).auth = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth as AuthPayload | undefined
    if (!auth) return res.status(401).json({ error: 'No auth' })
    if (!roles.includes(auth.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
