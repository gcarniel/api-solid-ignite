import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
