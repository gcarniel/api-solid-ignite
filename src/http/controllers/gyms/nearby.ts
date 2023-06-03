import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(req: FastifyRequest, rep: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

  const nearbyUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await nearbyUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  rep.status(200).send({ gyms })
}
