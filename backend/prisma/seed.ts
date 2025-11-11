import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@local'
  const password = 'admin123'
  const passwordHash = await bcrypt.hash(password, 10)

  const exists = await prisma.user.findUnique({ where: { email } })
  if (!exists) {
    await prisma.user.create({
      data: {
        email,
        nombre: 'Admin',
        passwordHash,
        role: Role.ADMIN
      }
    })
    console.log(`Seed OK: usuario admin -> ${email} / ${password}`)
  } else {
    console.log('Seed: admin ya existe, omitido.')
  }
}

main().finally(() => prisma.$disconnect())
