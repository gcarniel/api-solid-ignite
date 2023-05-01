import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-in use case ', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      description: '',
      title: 'JS Gym',
      phone: '',
      latitude: new Decimal(-22.1253749),
      longitude: new Decimal(-51.3613116),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -22.1253749,
      userLongitude: -51.3613116,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 1, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -22.1253749,
      userLongitude: -51.3613116,
    })

    await expect(() => {
      return sut.execute({
        gymId: 'gym-01',
        userId: 'user-id-01',
        userLatitude: -22.1253749,
        userLongitude: -51.3613116,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in difference days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 1, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -22.1253749,
      userLongitude: -51.3613116,
    })

    vi.setSystemTime(new Date(2023, 0, 2, 1, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -22.1253749,
      userLongitude: -51.3613116,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      title: 'JS Gym',
      phone: '',
      latitude: new Decimal(-22.0756584),
      longitude: new Decimal(-51.3559799),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id-01',
        userLatitude: -22.1253749,
        userLongitude: -51.3613116,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
