import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userIdToDelete: string, requestingUserId: string, accountId: string) {
    if (userIdToDelete === requestingUserId) {
      throw new Error("Você não pode excluir seu próprio usuário.");
    }

    const userToDelete = await this.userRepository.findById(userIdToDelete);
    if (!userToDelete || userToDelete.accountId !== accountId) {
      throw new Error("Usuário não encontrado ou não pertence a esta conta.");
    }
    
    // Adicionar lógica para não permitir excluir o último admin da conta
    
    await this.userRepository.delete(userIdToDelete);
  }
}