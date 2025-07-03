import { Request, Response } from 'express';
import { ExpenseRepository } from '../../infrastructure/repositories/ExpenseRepository';
import { GetInvoicesUseCase } from '../../application/use-cases/GetInvoicesUseCase';

export class InvoiceController {
  async list(req: Request, res: Response): Promise<Response> {
    const { monthYear } = req.query;
    const { accountId } = req.user;

    if (!monthYear) {
      throw new Error('O filtro "monthYear" é obrigatório.');
    }

    const expenseRepository = new ExpenseRepository();
    const useCase = new GetInvoicesUseCase(expenseRepository);
    const invoices = await useCase.execute(accountId, monthYear as string);

    return res.json(invoices);
  }
}