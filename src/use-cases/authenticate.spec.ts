import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Authenticate } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUsersRepository
let sut: Authenticate

describe('Authenticate user case ', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new Authenticate(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password_hash: await hash('1234567', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    await expect(() => {
      return sut.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    await userRepository.create({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password_hash: await hash('1234567', 6),
    })

    await expect(() => {
      return sut.execute({
        email: 'johndoe@gmail.com',
        password: '12341234',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
