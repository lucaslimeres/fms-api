import { Responsible } from './Responsible';

export class GroupMember {
  constructor(
    public responsible: Responsible,
    public weight: number,
    public groupId: string
  ) {}
}