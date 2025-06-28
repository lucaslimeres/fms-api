import { ResponsibleGroup } from '../../domain/entities/ResponsibleGroup';
import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';
import { CreateGroupDTO } from '../dtos/CreateGroupDTO';
import { randomUUID } from 'crypto';

export class CreateResponsibleGroupUseCase {
  constructor(private groupRepository: IResponsibleGroupRepository) {}

  async execute({ name, accountId }: CreateGroupDTO): Promise<ResponsibleGroup> {
    const group = new ResponsibleGroup(randomUUID(), name, accountId);
    return this.groupRepository.create(group);
  }
}