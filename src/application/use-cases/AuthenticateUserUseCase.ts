import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthenticateUserDTO } from '../dtos/AuthenticateUserDTO';

interface IResponse {
  user: {
    name: string;
    email: string;
    accountId: string;
    role: 'admin' | 'user';
  };
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: AuthenticateUserDTO): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const passwordMatch = await compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        accountId: user.accountId
      },
      'GEFIPEJWTSECRET',
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    const response: IResponse = {
      user: {
        name: user.name,
        email: user.email,
        accountId: user.accountId,
        role: user.role,
      },
      token,
    };

    return response;
  }
}
