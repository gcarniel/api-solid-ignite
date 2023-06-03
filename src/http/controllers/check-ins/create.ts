import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, rep: FastifyReply) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

  const { gymId } = createCheckInParamsSchema.parse(req.params)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: req.user.sub,
  })

  rep.status(201).send()
}
