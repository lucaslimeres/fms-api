import { ListExpensesDTO } from '../../application/dtos/ListExpensesDTO';
import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  createMany(expenses: Expense[]): Promise<void>;
  findAll(filter: ListExpensesDTO): Promise<any[]>;
  delete(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<Expense | null>;
  findAll(filter: ListExpensesDTO): Promise<any[]>;
}