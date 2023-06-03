import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, rep: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user: userProfile } = await getUserProfile.execute({
    userId: req.user.sub,
  })

  const { password_hash, ...user } = userProfile

  rep.status(200).send({
    user,
  })
}
