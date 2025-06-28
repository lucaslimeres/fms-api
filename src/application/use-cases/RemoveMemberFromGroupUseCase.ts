import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';

export class RemoveMemberFromGroupUseCase {
    constructor(private groupRepository: IResponsibleGroupRepository) {}

    async execute(groupId: string, responsibleId: string, accountId: string): Promise<void> {
        // Validações de existência podem ser adicionadas aqui
        await this.groupRepository.removeMember(groupId, responsibleId);
    }
}