import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('Email already exist')
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })

    return user
  }
}
