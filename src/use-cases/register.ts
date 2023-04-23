import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

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

  const prismaUsersRepository = new PrismaUsersRepository()

  const user = await prismaUsersRepository.create({
    email,
    name,
    password_hash: passwordHash,
  })

  return user
}
