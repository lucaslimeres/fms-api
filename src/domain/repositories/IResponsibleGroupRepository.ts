import { ResponsibleGroup } from '../entities/ResponsibleGroup';
import { GroupMember } from '../entities/GroupMember';

export interface IResponsibleGroupRepository {
  create(group: ResponsibleGroup): Promise<ResponsibleGroup>;
  findById(id: string, accountId: string): Promise<ResponsibleGroup | null>;
  findAllByAccountId(accountId: string): Promise<ResponsibleGroup[]>;
  addMember(member: GroupMember): Promise<void>;
  removeMember(groupId: string, responsibleId: string): Promise<void>;
}