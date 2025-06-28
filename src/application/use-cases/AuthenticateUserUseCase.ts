import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthenticateUserDTO } from '../dtos/AuthenticateUserDTO';

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: AuthenticateUserDTO): Promise<IResponse> {
    // 1. Verifica se o usuário existe
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha fornecida com o hash salvo no banco
    const passwordMatch = await compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 3. Gera o Token JWT
    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        accountId: user.accountId
      },
      'sua_chave_secreta_aqui', // **IMPORTANTE**: Use uma variável de ambiente para isso em produção!
      {
        subject: user.id,
        expiresIn: '1d', // Token expira em 1 dia
      }
    );

    // 4. Formata a resposta
    const response: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };

    return response;
  }
}
