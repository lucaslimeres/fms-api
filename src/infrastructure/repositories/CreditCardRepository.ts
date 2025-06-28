import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';
import { CreditCard } from '../../domain/entities/CreditCard';
import db from '../database/mysql';

export class CreditCardRepository implements ICreditCardRepository {
  async create(card: CreditCard): Promise<CreditCard> {
    const sql = 'INSERT INTO credit_cards (card_id, name, due_day, closing_day, account_id) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [card.id, card.name, card.dueDay, card.closingDay, card.accountId]);
    return card;
  }

  async update(card: CreditCard): Promise<CreditCard> {
    const sql = 'UPDATE credit_cards SET name = ?, due_day = ?, closing_day = ? WHERE card_id = ? AND account_id = ?';
    await db.query(sql, [card.name, card.dueDay, card.closingDay, card.id, card.accountId]);
    return card;
  }

  async delete(id: string, accountId: string): Promise<void> {
    const sql = 'DELETE FROM credit_cards WHERE card_id = ? AND account_id = ?';
    await db.query(sql, [id, accountId]);
  }

  async findById(id: string, accountId: string): Promise<CreditCard | null> {
    const sql = 'SELECT * FROM credit_cards WHERE card_id = ? AND account_id = ?';
    const [rows]: any[] = await db.query(sql, [id, accountId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new CreditCard(row.card_id, row.name, row.due_day, row.closing_day, row.account_id);
  }

  async findByName(name: string, accountId: string): Promise<CreditCard | null> {
    const sql = 'SELECT * FROM credit_cards WHERE name = ? AND account_id = ?';
    const [rows]: any[] = await db.query(sql, [name, accountId]);
     if (rows.length === 0) return null;
    const row = rows[0];
    return new CreditCard(row.card_id, row.name, row.due_day, row.closing_day, row.account_id);
  }

  async findAllByAccountId(accountId: string): Promise<CreditCard[]> {
    const sql = 'SELECT * FROM credit_cards WHERE account_id = ? ORDER BY name ASC';
    const [rows]: any[] = await db.query(sql, [accountId]);
    return rows.map((row: any) => new CreditCard(row.card_id, row.name, row.due_day, row.closing_day, row.account_id));
  }
}