import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { Expense } from '../../domain/entities/Expense';
import db from '../database/mysql';
import { ListExpensesDTO } from '../../application/dtos/ListExpensesDTO';
import { QueryResult } from 'mysql2';

export class ExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const sql = `
      INSERT INTO expenses (
        expense_id, account_id, responsible_id, group_id, category_id, description, amount, 
        reference_date, reference_month_year, type, status, bill_type, card_id, 
        is_installment, installment_group_id, installment_number, installment_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [
      expense.id, expense.accountId, expense.responsibleId, expense.groupId, expense.categoryId,
      expense.description, expense.amount, expense.referenceDate, expense.referenceMonthYear,
      expense.type, expense.status, expense.billType, expense.cardId, expense.isInstallment,
      expense.installmentGroupId, expense.installmentNumber, expense.installmentTotal
    ]);
    return expense;
  }

  async createMany(expenses: Expense[]): Promise<void> {
    // Usando uma transação para garantir que todas as parcelas sejam salvas ou nenhuma seja.
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      const sql = `
        INSERT INTO expenses (
          expense_id, account_id, responsible_id, group_id, category_id, description, amount, 
          reference_date, reference_month_year, type, status, bill_type, card_id, 
          is_installment, installment_group_id, installment_number, installment_total
        ) VALUES ?
      `;
      const values = expenses.map(e => [
          e.id, e.accountId, e.responsibleId, e.groupId, e.categoryId, e.description, e.amount,
          e.referenceDate, e.referenceMonthYear, e.type, e.status, e.billType, e.cardId,
          e.isInstallment, e.installmentGroupId, e.installmentNumber, e.installmentTotal
      ]);
      await connection.query(sql, [values]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: string, accountId: string): Promise<Expense | null> {
    const sql = 'SELECT * FROM expenses WHERE expense_id = ? AND account_id = ?';
    const [rows]: any[] = await db.query(sql, [id, accountId]);
    if(rows.length === 0) return null;
    const row = rows[0];
    return new Expense(
        row.expense_id, row.account_id, row.category_id, row.description, row.amount, 
        new Date(row.reference_date), row.reference_month_year, row.type, row.status, 
        row.responsible_id, row.group_id, row.bill_type, row.card_id,
        row.is_installment, row.installment_group_id, row.installment_number, row.installment_total,
        row.payment_date ? new Date(row.payment_date) : undefined
    );
  }

  async update(expense: Expense): Promise<Expense> {
    const sql = `
        UPDATE expenses SET
            description = ?,
            amount = ?,
            reference_date = ?,
            status = ?,
            payment_date = ?
        WHERE expense_id = ? AND account_id = ?
    `;
    await db.query(sql, [
        expense.description,
        expense.amount,
        expense.referenceDate,
        expense.status,
        expense.paymentDate,
        expense.id,
        expense.accountId
    ]);
    return expense;
  }

  async delete(id: string, accountId: string): Promise<void> {
    const sql = 'DELETE FROM expenses WHERE expense_id = ? AND account_id = ?';
    await db.query(sql, [id, accountId]);
  }  

  async findAll(filter: ListExpensesDTO): Promise<any[]> {
    let sql = `
        SELECT 
            e.*, 
            c.name as category_name,
            r.name as responsible_name,
            g.name as group_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.category_id
        LEFT JOIN responsibles r ON e.responsible_id = r.responsible_id
        LEFT JOIN responsible_groups g ON e.group_id = g.group_id
        WHERE e.account_id = ? AND e.reference_month_year = ?
    `;
    const params: any[] = [filter.accountId, filter.monthYear];

    if (filter.responsibleId) {
      sql += ' AND e.responsible_id = ?';
      params.push(filter.responsibleId);
    }
    if (filter.groupId) {
        sql += ' AND e.group_id = ?';
        params.push(filter.groupId);
    }
    if (filter.cardId) {
        sql += ' AND e.card_id = ?';
        params.push(filter.cardId);
    }

    sql += ' ORDER BY e.reference_date ASC';

    const [rows]: any[] = await db.query(sql, params);

    return rows;
  }  
}