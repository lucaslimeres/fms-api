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
    expense.billType = data.billType ?? expense.billType;
    expense.cardId = data.cardId ?? expense.cardId;
    expense.categoryId = data.categoryId ?? expense.categoryId;
    expense.responsibleId = data.responsibleId ?? expense.responsibleId;
    expense.referenceDate = data.referenceDate ? new Date(data.referenceDate) : expense.referenceDate;
    expense.referenceMonthYear = data.referenceMonthYear ?? expense.referenceMonthYear;
    
    // Outros campos como categoryId podem ser adicionados aqui

    return this.expenseRepository.update(expense);
  }
}