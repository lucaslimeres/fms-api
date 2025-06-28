import { GroupMember } from '../../domain/entities/GroupMember';
import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';
import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';
import { ManageMemberDTO } from '../dtos/ManageMemberDTO';

export class AddMemberToGroupUseCase {
  constructor(
    private groupRepository: IResponsibleGroupRepository,
    private responsibleRepository: IResponsibleRepository
  ) {}

  async execute({ groupId, responsibleId, weight, accountId }: ManageMemberDTO): Promise<void> {
    const group = await this.groupRepository.findById(groupId, accountId);
    if (!group) throw new Error('Grupo não encontrado.');

    const responsible = await this.responsibleRepository.findById(responsibleId, accountId);
    if (!responsible) throw new Error('Responsável não encontrado.');

    const member = new GroupMember(responsible, weight, groupId);
    await this.groupRepository.addMember(member);
  }
}