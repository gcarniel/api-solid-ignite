import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcryptjs'

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = userSchema.parse(req.body)

  const passwordHash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

  if (userWithSameEmail) {
    return rep.status(409).send()
  }

  await prisma.user.create({
    data: { email, name, password_hash: passwordHash },
  })

  rep.status(201).send()
}
