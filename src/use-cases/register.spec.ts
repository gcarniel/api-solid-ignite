import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-erro'

let userRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register user case ', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'john doe',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'johndoe@gmail.com'

    await sut.execute({
      email,
      name: 'john doe',
      password: '1234567',
    })

    await expect(() => {
      return sut.execute({
        email,
        name: 'john doe',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
