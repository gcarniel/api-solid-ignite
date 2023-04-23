import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = userSchema.parse(req.body)

  await prisma.user.create({
    data: { email, name, password_hash: password },
  })

  rep.status(201).send()
}
