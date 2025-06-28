import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';
import { Responsible } from '../../domain/entities/Responsible';
import db from '../database/mysql';

export class ResponsibleRepository implements IResponsibleRepository {
  async create(responsible: Responsible): Promise<Responsible> {
    const sql = `
      INSERT INTO responsibles (responsible_id, name, account_id, is_active) 
      VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [responsible.id, responsible.name, responsible.accountId, responsible.isActive]);
    return responsible;
  }

  async update(responsible: Responsible): Promise<Responsible> {
    const sql = 'UPDATE responsibles SET name = ? WHERE responsible_id = ? AND account_id = ?';
    await db.query(sql, [responsible.name, responsible.id, responsible.accountId]);
    return responsible;
  }

  async delete(id: string, accountId: string): Promise<void> {
    // Implementa um "soft delete", apenas inativando o responsável.
    const sql = 'UPDATE responsibles SET is_active = FALSE WHERE responsible_id = ? AND account_id = ?';
    await db.query(sql, [id, accountId]);
  }

  async findById(id: string, accountId: string): Promise<Responsible | null> {
    const sql = 'SELECT * FROM responsibles WHERE responsible_id = ? AND account_id = ? AND is_active = TRUE';
    const [rows]: any[] = await db.query(sql, [id, accountId]);

    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    return new Responsible(row.responsible_id, row.name, row.account_id, row.is_active);
  }

  async findAllByAccountId(accountId: string): Promise<Responsible[]> {
    const sql = 'SELECT * FROM responsibles WHERE account_id = ? AND is_active = TRUE';
    const [rows]: any[] = await db.query(sql, [accountId]);
    
    return rows.map((row:any) => new Responsible(row.responsible_id, row.name, row.account_id, row.is_active));
  }
}
