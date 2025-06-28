import { Expense } from '../../domain/entities/Expense';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';

export class PayExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}
  
  async execute(id: string, accountId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id, accountId);
    if (!expense) {
      throw new Error('Despesa não encontrada ou não pertence a esta conta.');
    }

    expense.status = 'paid';
    expense.paymentDate = new Date();

    return this.expenseRepository.update(expense);
  }
}