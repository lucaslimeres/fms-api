import { ListExpensesDTO } from '../../application/dtos/ListExpensesDTO';
import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  createMany(expenses: Expense[]): Promise<void>;
  findAll(filter: ListExpensesDTO): Promise<any[]>;
  delete(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<Expense | null>;
  update(expense: Expense): Promise<Expense>
  findAll(filter: ListExpensesDTO): Promise<any[]>;
  getSummaryByMonth(accountId: string, monthYear: string): Promise<any>;
  getSummaryByMonth(accountId: string, monthYear: string): Promise<any>;
  getSummaryByResponsible(accountId: string, monthYear: string): Promise<any[]>;
  getRecentExpenses(accountId: string, limit?: number): Promise<any[]>;
  getInvoicesByMonth(accountId: string, monthYear: string): Promise<any[]>;
}