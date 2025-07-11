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
            category_id = ?,
            responsible_id = ?,
            card_id = ?,
            description = ?,
            amount = ?,
            bill_type = ?,
            reference_date = ?,
            status = ?,
            payment_date = ?,
            reference_month_year = ?
        WHERE expense_id = ? AND account_id = ?
    `;
    await db.query(sql, [
        expense.categoryId,
        expense.responsibleId,
        expense.cardId,
        expense.description,
        expense.amount,
        expense.billType,
        expense.referenceDate,
        expense.status,
        expense.paymentDate,
        expense.referenceMonthYear,
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

  async getSummaryByMonth(accountId: string, monthYear: string): Promise<any> {
    const sql = `
      SELECT
        SUM(amount) as totalExpenses,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid,
        SUM(CASE WHEN type = 'credit_card' THEN amount ELSE 0 END) as cardBill
      FROM expenses
      WHERE account_id = ? AND reference_month_year = ?
    `;
    const params = [accountId, monthYear];
    const [rows]: any[] = await db.query(sql, params);

    // Retorna os dados agregados, formatando para strings se necessário.
    const summary = rows[0];
    return {
      totalExpenses: parseFloat(summary.totalExpenses || 0).toFixed(2),
      pending: parseFloat(summary.pending || 0).toFixed(2),
      paid: parseFloat(summary.paid || 0).toFixed(2),
      cardBill: parseFloat(summary.cardBill || 0).toFixed(2),
    };
  }

  async getSummaryByResponsible(accountId: string, monthYear: string): Promise<any[]> {
    // Esta query complexa calcula o total para responsáveis individuais
    // e também distribui o valor dos grupos para cada membro baseado no peso.
    const sql = `
      WITH GroupTotals AS (
        SELECT 
          g.group_id,
          SUM(e.amount) as total_group_expense
        FROM expenses e
        JOIN responsible_groups g ON e.group_id = g.group_id
        WHERE e.account_id = ? AND e.reference_month_year = ?
        GROUP BY g.group_id
      ),
      MemberWeights AS (
        SELECT 
          group_id,
          SUM(weight) as total_weight
        FROM group_members
        GROUP BY group_id
      ),
      ResponsibleGroupExpenses AS (
        SELECT 
          gm.responsible_id,
          SUM((gt.total_group_expense / mw.total_weight) * gm.weight) as group_amount
        FROM group_members gm
        JOIN GroupTotals gt ON gm.group_id = gt.group_id
        JOIN MemberWeights mw ON gm.group_id = mw.group_id
        GROUP BY gm.responsible_id
      ),
      DirectExpenses AS (
        SELECT 
          responsible_id,
          SUM(amount) as direct_amount
        FROM expenses
        WHERE account_id = ? AND reference_month_year = ? AND responsible_id IS NOT NULL
        GROUP BY responsible_id
      )
      SELECT
        r.name,
        COALESCE(de.direct_amount, 0) + COALESCE(rge.group_amount, 0) as total
      FROM responsibles r
      LEFT JOIN DirectExpenses de ON r.responsible_id = de.responsible_id
      LEFT JOIN ResponsibleGroupExpenses rge ON r.responsible_id = rge.responsible_id
      WHERE r.account_id = ?
      HAVING total > 0
      ORDER BY total DESC;
    `;
    const params = [accountId, monthYear, accountId, monthYear, accountId];
    const [rows]: any[] = await db.query(sql, params);
    return rows;
  }

  async getRecentExpenses(accountId: string, limit: number = 5): Promise<any[]> {
    const sql = `
      SELECT 
        e.expense_id,
        e.description,
        e.amount,
        c.name as category_name
      FROM expenses e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.account_id = ?
      ORDER BY e.reference_date DESC
      LIMIT ?
    `;
    const [rows]: any[] = await db.query(sql, [accountId, limit]);
    return rows;
  }
  
  async getInvoicesByMonth(accountId: string, monthYear: string): Promise<any[]> {
    const [responsibles]: any[] = await db.query(
      'SELECT * FROM responsibles WHERE account_id = ? AND is_active = TRUE',
      [accountId]
    );

    const invoices = await Promise.all(
      responsibles.map(async (responsible: any) => {
        // 1. Despesas diretas do tipo 'bill'
        const billsSql = `
          SELECT e.*, c.name as category_name 
          FROM expenses e
          JOIN categories c ON e.category_id = c.category_id
          WHERE e.account_id = ? AND e.reference_month_year = ? AND e.responsible_id = ? AND e.type = 'bill'
        `;
        const [directBills] = await db.query(billsSql, [accountId, monthYear, responsible.responsible_id]);

        // 2. Despesas diretas do tipo 'credit_card'
        const directCardSql = `
          SELECT e.*, c.name as category_name, cc.name as card_name, cc.card_id
          FROM expenses e
          JOIN categories c ON e.category_id = c.category_id
          JOIN credit_cards cc ON e.card_id = cc.card_id
          WHERE e.account_id = ? AND e.reference_month_year = ? AND e.responsible_id = ? AND e.type = 'credit_card'
        `;
        const [directCardExpenses] = await db.query(directCardSql, [accountId, monthYear, responsible.responsible_id]);

        // 3. Despesas de grupo (ambos os tipos)
        const groupsSql = `
          SELECT 
            e.*, c.name as category_name, g.name as group_name, gm.weight, 
            (SELECT SUM(weight) FROM group_members WHERE group_id = e.group_id) as total_weight,
            cc.name as card_name, cc.card_id
          FROM expenses e
          JOIN categories c ON e.category_id = c.category_id
          JOIN responsible_groups g ON e.group_id = g.group_id
          JOIN group_members gm ON e.group_id = gm.group_id AND gm.responsible_id = ?
          LEFT JOIN credit_cards cc ON e.card_id = cc.card_id
          WHERE e.account_id = ? AND e.reference_month_year = ? AND e.group_id IS NOT NULL
        `;
        const [groupExpensesRaw] = await db.query(groupsSql, [responsible.responsible_id, accountId, monthYear]);
        
        const groupBills: any[] = [];
        const groupCardExpenses: any[] = [];

        (groupExpensesRaw as any[]).forEach(exp => {
            const proportionalAmount = (exp.amount / exp.total_weight) * exp.weight;
            const processedExp = { ...exp, amount: proportionalAmount };
            if (exp.type === 'bill') {
                groupBills.push(processedExp);
            } else if (exp.type === 'credit_card') {
                groupCardExpenses.push(processedExp);
            }
        });
        
        // 4. Combina despesas de cartão diretas e de grupo
        const allCardExpenses = [...(directCardExpenses as any[]), ...groupCardExpenses];

        // 5. Agrupa todas as despesas de cartão pelo cartão
        const cardExpensesGrouped = allCardExpenses.reduce((acc, expense) => {
            const cardId = expense.card_id;
            if (!acc[cardId]) {
                acc[cardId] = {
                    card_id: cardId,
                    card_name: expense.card_name,
                    total: 0,
                    status: 'Fatura Aberta', 
                    expenses: []
                };
            }
            acc[cardId].total += parseFloat(expense.amount);
            acc[cardId].expenses.push(expense);
            return acc;
        }, {});


        const cardExpenses = cardExpensesGrouped.map((item: any) => {
          // Lógica para determinar o status da fatura
          let status = 'Fatura Aberta';
          if (item.expense.length === 0) {
              status = 'Sem Gastos'; // NOVO STATUS
          } else if (item.expense.every((exp: any) => exp.status === 'paid')) {
              status = 'Fatura Paga';
          }
        })

        return {
          responsible,
          bills: [...(directBills as any[]), ...groupBills],
          cardExpenses: Object.values(cardExpenses),
          groupExpenses: [] // Não é mais necessário, pois foi dividido
        };
      })
    );
    return invoices;
  }
}