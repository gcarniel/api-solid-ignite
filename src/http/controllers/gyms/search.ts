import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(req: FastifyRequest, rep: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(req.query)

  const searchUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchUseCase.execute({ query: q, page })

  rep.status(200).send({ gyms })
}
