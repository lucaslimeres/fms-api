import { Expense } from '../../domain/entities/Expense';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { UpdateExpenseDTO } from '../dtos/UpdateExpenseDTO';

export class UpdateExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await this.expenseRepository.findById(data.id, data.accountId);
    if (!expense) {
      throw new Error('Despesa não encontrada ou não pertence a esta conta.');
    }

    // Atualiza apenas os campos fornecidos
    expense.description = data.description ?? expense.description;
    expense.amount = data.amount ?? expense.amount;
    expense.referenceDate = data.referenceDate ? new Date(data.referenceDate) : expense.referenceDate;
    
    // Outros campos como categoryId podem ser adicionados aqui

    return this.expenseRepository.update(expense);
  }
}