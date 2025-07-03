import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { GetDashboardDTO } from '../dtos/GetDashboardDTO';

export class GetDashboardDataUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute({ accountId, monthYear }: GetDashboardDTO): Promise<any> {
    const [summary, byResponsible, recent] = await Promise.all([
      this.expenseRepository.getSummaryByMonth(accountId, monthYear),
      this.expenseRepository.getSummaryByResponsible(accountId, monthYear),
      this.expenseRepository.getRecentExpenses(accountId, 5)
    ]);

    return {
      summary,
      byResponsible,
      recent
    };
  }
}