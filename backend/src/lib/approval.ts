import { Role } from '@prisma/client'

// Regla mínima: quién aprueba el cambio de superior según rol del solicitante
export function getRequiredApproverRole(requesterRole: Role): Role | null {
  switch (requesterRole) {
    case 'TECNICO_PROD':
    case 'TECNICO_SOC':
      return 'FACILITADOR'
    case 'FACILITADOR':
      return 'TERRITORIAL'
    case 'TERRITORIAL':
      return 'COORD_TERRITORIAL'
    case 'COORD_TERRITORIAL':
      return 'ADMIN' // o null si no requiere aprobación; ajusta según tu política
    case 'ADMIN':
      return null // admin no necesita aprobación
    default:
      return null
  }
}
