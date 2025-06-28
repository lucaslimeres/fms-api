import { Request, Response } from 'express';
import { ExpenseRepository } from '../../infrastructure/repositories/ExpenseRepository';
import { CreateExpenseUseCase } from '../../application/use-cases/CreateExpenseUseCase';
import { ListExpensesUseCase } from '../../application/use-cases/ListExpensesUseCase';
import { UpdateExpenseUseCase } from '../../application/use-cases/UpdateExpenseUseCase';
import { PayExpenseUseCase } from '../../application/use-cases/PayExpenseUseCase';
import { DeleteExpenseUseCase } from '../../application/use-cases/DeleteExpenseUseCase';


export class ExpenseController {
  async create(req: Request, res: Response): Promise<Response> {
    const expenseData = req.body;
    const { accountId } = req.user;

    const expenseRepository = new ExpenseRepository();
    const useCase = new CreateExpenseUseCase(expenseRepository);

    await useCase.execute({ ...expenseData, accountId });

    return res.status(201).send();
  }

  async list(req: Request, res: Response): Promise<Response> {
    // Os filtros virão da query string da URL (ex: ?monthYear=2025-07)
    const { monthYear, responsibleId, groupId, cardId } = req.query;
    const { accountId } = req.user;

    if (!monthYear) {
      throw new Error('O filtro "monthYear" (formato YYYY-MM) é obrigatório.');
    }

    const expenseRepository = new ExpenseRepository();
    const useCase = new ListExpensesUseCase(expenseRepository);

    const expenses = await useCase.execute({
      accountId,
      monthYear: monthYear as string,
      responsibleId: responsibleId as string | undefined,
      groupId: groupId as string | undefined,
      cardId: cardId as string | undefined,
    });
    
    return res.json(expenses);
  }

 async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateData = req.body;
    const { accountId } = req.user;

    const expenseRepository = new ExpenseRepository();
    const useCase = new UpdateExpenseUseCase(expenseRepository);

    const expense = await useCase.execute({ ...updateData, id, accountId });
    return res.json(expense);
  }

  async pay(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { accountId } = req.user;
    
    const expenseRepository = new ExpenseRepository();
    const useCase = new PayExpenseUseCase(expenseRepository);
    
    const expense = await useCase.execute(id, accountId);
    return res.json(expense);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { accountId } = req.user;
    
    const expenseRepository = new ExpenseRepository();
    const useCase = new DeleteExpenseUseCase(expenseRepository);

    await useCase.execute(id, accountId);
    return res.status(204).send();
  }  
}