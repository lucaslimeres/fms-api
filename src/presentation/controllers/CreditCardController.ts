import { Request, Response } from 'express';
import { CreditCardRepository } from '../../infrastructure/repositories/CreditCardRepository';
import { CreateCreditCardUseCase } from '../../application/use-cases/CreateCreditCardUseCase';
import { ListCreditCardsUseCase } from '../../application/use-cases/ListCreditCardsUseCase';
import { UpdateCreditCardUseCase } from '../../application/use-cases/UpdateCreditCardUseCase';
import { DeleteCreditCardUseCase } from '../../application/use-cases/DeleteCreditCardUseCase';

export class CreditCardController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, dueDay, closingDay } = req.body;
    const { accountId } = req.user;
    const creditCardRepository = new CreditCardRepository();
    const useCase = new CreateCreditCardUseCase(creditCardRepository);
    const card = await useCase.execute({ name, dueDay, closingDay, accountId });
    return res.status(201).json(card);
  }

  async list(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.user;
    const creditCardRepository = new CreditCardRepository();
    const useCase = new ListCreditCardsUseCase(creditCardRepository);
    const cards = await useCase.execute(accountId);
    return res.json(cards);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, dueDay, closingDay } = req.body;
    const { accountId } = req.user;
    const creditCardRepository = new CreditCardRepository();
    const useCase = new UpdateCreditCardUseCase(creditCardRepository);
    const card = await useCase.execute({ id, name, dueDay, closingDay, accountId });
    return res.json(card);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { accountId } = req.user;
    const creditCardRepository = new CreditCardRepository();
    const useCase = new DeleteCreditCardUseCase(creditCardRepository);
    await useCase.execute(id, accountId);
    return res.status(204).send();
  }
}