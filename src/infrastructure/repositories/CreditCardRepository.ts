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

 async findFaturasByMonth(accountId: string, monthYear: string): Promise<any[]> {
    const cards = await this.findAllByAccountId(accountId);

    const faturas = await Promise.all(
      cards.map(async (card) => {
        const expensesSql = `
          SELECT 
            e.expense_id, e.description, e.amount, e.reference_date, e.status,
            c.name as category_name,
            COALESCE(r.name, rg.name) as responsible_name
          FROM expenses e
          LEFT JOIN categories c ON e.category_id = c.category_id
          LEFT JOIN responsibles r ON e.responsible_id = r.responsible_id
          LEFT JOIN responsible_groups rg ON e.group_id = rg.group_id
          WHERE e.account_id = ? AND e.reference_month_year = ? AND e.card_id = ?
          ORDER BY e.reference_date DESC
        `;
        const [expenses]: any[] = await db.query(expensesSql, [accountId, monthYear, card.id]);
        
        const total = expenses.reduce((acc: any, exp: any) => acc + parseFloat(exp.amount), 0);
        
        // Lógica para determinar o status da fatura
        let status = 'Fatura Aberta';
        if (expenses.length === 0) {
            status = 'Sem Gastos'; // NOVO STATUS
        } else if (expenses.every((exp: any) => exp.status === 'paid')) {
            status = 'Fatura Paga';
        }

        return {
          ...card,
          total: total.toFixed(2),
          status,
          expenses,
        };
      })
    );

    return faturas;
  }
  
  async payFatura(cardId: string, accountId: string, monthYear: string): Promise<void> {
    const sql = `
      UPDATE expenses 
      SET status = 'paid', payment_date = NOW() 
      WHERE card_id = ? AND account_id = ? AND reference_month_year = ? AND type = 'credit_card'
    `;
    await db.query(sql, [cardId, accountId, monthYear]);
  }
}