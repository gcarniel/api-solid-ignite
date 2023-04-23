import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUsecase } from '@/use-cases/register'

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = userSchema.parse(req.body)

  try {
    await registerUsecase({ email, name, password })
  } catch {
    return rep.status(409).send()
  }

  rep.status(201).send()
}
