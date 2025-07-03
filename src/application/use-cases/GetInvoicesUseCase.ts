import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';

export class GetInvoicesUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(accountId: string, monthYear: string): Promise<any[]> {
    return this.expenseRepository.getInvoicesByMonth(accountId, monthYear);
  }
}