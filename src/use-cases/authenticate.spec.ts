import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Authenticate } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate user case ', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new Authenticate(userRepository)

    await userRepository.create({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password_hash: await hash('1234567', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new Authenticate(userRepository)

    await expect(() => {
      return authenticateUseCase.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new Authenticate(userRepository)

    await userRepository.create({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password_hash: await hash('1234567', 6),
    })

    await expect(() => {
      return authenticateUseCase.execute({
        email: 'johndoe@gmail.com',
        password: '12341234',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
