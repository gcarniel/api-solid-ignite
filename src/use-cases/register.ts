import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUsecase({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const passwordHash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

  if (userWithSameEmail) {
    throw new Error('Email already exist')
  }

  await prisma.user.create({
    data: { email, name, password_hash: passwordHash },
  })
}
