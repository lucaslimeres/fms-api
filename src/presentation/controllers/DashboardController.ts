import { Request, Response } from 'express';
import { ExpenseRepository } from '../../infrastructure/repositories/ExpenseRepository';
import { GetDashboardDataUseCase } from '../../application/use-cases/GetDashboardDataUseCase';

export class DashboardController {
  async getSummary(req: Request, res: Response): Promise<Response> {
    const { monthYear } = req.query;
    const { accountId } = req.user;

    if (!monthYear) {
      throw new Error('O filtro "monthYear" é obrigatório.');
    }

    const expenseRepository = new ExpenseRepository();
    const useCase = new GetDashboardDataUseCase(expenseRepository);

    const summary = await useCase.execute({
      accountId,
      monthYear: monthYear as string,
    });

    return res.json(summary);
  }
}