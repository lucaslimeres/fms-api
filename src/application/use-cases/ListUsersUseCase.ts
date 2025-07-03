import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(accountId: string) {
    return this.userRepository.findAllByAccountId(accountId);
  }
}