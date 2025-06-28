import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';

export class DeleteExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string, accountId: string): Promise<void> {
    const expense = await this.expenseRepository.findById(id, accountId);
    if (!expense) {
      throw new Error('Despesa não encontrada ou não pertence a esta conta.');
    }
    // Adicionar validação para não deletar despesa de parcela única, etc.
    await this.expenseRepository.delete(id, accountId);
  }
}