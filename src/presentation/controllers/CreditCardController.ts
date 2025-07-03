import { Request, Response } from 'express';
import { CreditCardRepository } from '../../infrastructure/repositories/CreditCardRepository';
import { CreateCreditCardUseCase } from '../../application/use-cases/CreateCreditCardUseCase';
import { ListCreditCardsUseCase } from '../../application/use-cases/ListCreditCardsUseCase';
import { UpdateCreditCardUseCase } from '../../application/use-cases/UpdateCreditCardUseCase';
import { DeleteCreditCardUseCase } from '../../application/use-cases/DeleteCreditCardUseCase';
import { GetCardFaturasUseCase } from '../../application/use-cases/GetCardFaturasUseCase';
import { PayCardFaturaUseCase } from '../../application/use-cases/PayCardFaturaUseCase';

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

  async getFaturas(req: Request, res: Response): Promise<Response> {
    const { monthYear } = req.query;
    const { accountId } = req.user;

    if (!monthYear) {
      throw new Error('O filtro "monthYear" é obrigatório.');
    }

    const creditCardRepository = new CreditCardRepository();
    const useCase = new GetCardFaturasUseCase(creditCardRepository);
    const faturas = await useCase.execute(accountId, monthYear as string);

    return res.json(faturas);
  }
  
  async payFatura(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // cardId
    const { monthYear } = req.body;
    const { accountId } = req.user;

    if (!monthYear) {
      throw new Error('O campo "monthYear" é obrigatório.');
    }

    const creditCardRepository = new CreditCardRepository();
    const useCase = new PayCardFaturaUseCase(creditCardRepository);
    await useCase.execute(id, accountId, monthYear);

    return res.status(204).send();
  }
}