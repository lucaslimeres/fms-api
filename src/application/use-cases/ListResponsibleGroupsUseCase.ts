import { ResponsibleGroup } from '../../domain/entities/ResponsibleGroup';
import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';

export class ListResponsibleGroupsUseCase {
    constructor(private groupRepository: IResponsibleGroupRepository) {}

    async execute(accountId: string): Promise<ResponsibleGroup[]> {
        return this.groupRepository.findAllByAccountId(accountId);
    }
}