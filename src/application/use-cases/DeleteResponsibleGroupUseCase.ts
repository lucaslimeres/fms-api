import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';

export class DeleteResponsibleGroupUseCase {
  constructor(private groupRepository: IResponsibleGroupRepository) {}

  async execute(id: string, accountId: string): Promise<void> {
    const group = await this.groupRepository.findById(id, accountId);
    if (!group) {
      throw new Error('Grupo não encontrado ou não pertence a esta conta.');
    }
    await this.groupRepository.delete(id, accountId);
  }
}