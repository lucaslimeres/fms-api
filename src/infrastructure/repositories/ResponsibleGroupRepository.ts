import { IResponsibleGroupRepository } from '../../domain/repositories/IResponsibleGroupRepository';
import { ResponsibleGroup } from '../../domain/entities/ResponsibleGroup';
import { GroupMember } from '../../domain/entities/GroupMember';
import { Responsible } from '../../domain/entities/Responsible';
import db from '../database/mysql';

export class ResponsibleGroupRepository implements IResponsibleGroupRepository {
  async create(group: ResponsibleGroup): Promise<ResponsibleGroup> {
    const sql = 'INSERT INTO responsible_groups (group_id, name, account_id) VALUES (?, ?, ?)';
    await db.query(sql, [group.id, group.name, group.accountId]);
    return group;
  }

  async findById(id: string, accountId: string): Promise<ResponsibleGroup | null> {
    const groupSql = 'SELECT * FROM responsible_groups WHERE group_id = ? AND account_id = ?';
    const [groupRows]: any[] = await db.query(groupSql, [id, accountId]);

    if (groupRows.length === 0) return null;
    const groupData = groupRows[0];
    const group = new ResponsibleGroup(groupData.group_id, groupData.name, groupData.account_id);

    const membersSql = `
        SELECT r.*, gm.weight 
        FROM group_members gm
        JOIN responsibles r ON gm.responsible_id = r.responsible_id
        WHERE gm.group_id = ?
    `;
    const [memberRows]: any[] = await db.query(membersSql, [id]);
    group.members = memberRows.map((row: any) => {
        const responsible = new Responsible(row.responsible_id, row.name, row.account_id, row.is_active);
        return new GroupMember(responsible, row.weight, group.id);
    });

    return group;
  }
  
  async findAllByAccountId(accountId: string): Promise<ResponsibleGroup[]> {
    // Esta implementação busca todos os grupos e depois os membros de cada um.
    // Em uma aplicação real, otimizações podem ser necessárias.
    const sql = 'SELECT * FROM responsible_groups WHERE account_id = ?';
    const [groupsData]: any[] = await db.query(sql, [accountId]);

    const groups: ResponsibleGroup[] = [];
    for(const groupData of groupsData) {
        const group = await this.findById(groupData.group_id, accountId);
        if(group) groups.push(group);
    }
    return groups;
  }

  async addMember(member: GroupMember): Promise<void> {
    const sql = 'INSERT INTO group_members (group_id, responsible_id, weight) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE weight = ?';
    await db.query(sql, [member.groupId, member.responsible.id, member.weight, member.weight]);
  }

  async removeMember(groupId: string, responsibleId: string): Promise<void> {
    const sql = 'DELETE FROM group_members WHERE group_id = ? AND responsible_id = ?';
    await db.query(sql, [groupId, responsibleId]);
  }
}