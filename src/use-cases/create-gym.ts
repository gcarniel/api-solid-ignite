import { GymsRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUserCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  }: CreateGymUseCaseRequest): Promise<CreateGymUserCaseResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone,
    })

    return { gym }
  }
}
