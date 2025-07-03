import { ResponsibleGroup } from '../../domain/entities/ResponsibleGroup';
import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';

export class UpdateResponsibleGroupUseCase {
  constructor(private groupRepository: IResponsibleGroupRepository) {}

  async execute(id: string, name: string, accountId: string): Promise<ResponsibleGroup> {
    const group = await this.groupRepository.findById(id, accountId);
    if (!group) {
      throw new Error('Grupo não encontrado.');
    }
    group.name = name;
    return this.groupRepository.update(group);
  }
}