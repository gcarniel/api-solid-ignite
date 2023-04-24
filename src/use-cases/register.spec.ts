import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-erro'

describe('Register user case ', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'john doe',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'john doe',
      password: '1234567',
    })

    const isPasswordCorrectlyHashed = await compare(
      '1234567',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'johndoe@gmail.com'

    await registerUseCase.execute({
      email,
      name: 'john doe',
      password: '1234567',
    })

    expect(() => {
      return registerUseCase.execute({
        email,
        name: 'john doe',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
