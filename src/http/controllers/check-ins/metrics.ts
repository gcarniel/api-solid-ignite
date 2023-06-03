import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-fetch-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(req: FastifyRequest, rep: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: req.user.sub,
  })

  rep.status(200).send({ checkInsCount })
}
