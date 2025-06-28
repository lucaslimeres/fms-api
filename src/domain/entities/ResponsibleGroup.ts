import { GroupMember } from './GroupMember';

export class ResponsibleGroup {
  public members: GroupMember[];

  constructor(
    public readonly id: string,
    public name: string,
    public readonly accountId: string,
    members: GroupMember[] = []
  ) {
    this.members = members;
  }
}