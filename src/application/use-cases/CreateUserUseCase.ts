import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password, accountId, role }: CreateUserDTO): Promise<User> {
    // 1. Regra de Negócio: Verifica se o e-mail já está em uso
    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new Error('O e-mail informado já está em uso.');
    }

    // 2. Regra de Negócio: Criptografa a senha
    const passwordHash = await hash(password, 8);

    // 3. Cria a nova entidade de usuário
    const user = new User(
      randomUUID(),
      name,
      email,
      role,
      accountId,
      passwordHash
    );

    // 4. Salva o usuário no banco de dados através do repositório
    await this.userRepository.save(user);

    return user;
  }
}