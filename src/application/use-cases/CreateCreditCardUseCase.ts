import { CreditCard } from '../../domain/entities/CreditCard';
import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';
import { CreateCreditCardDTO } from '../dtos/CreateCreditCardDTO';
import { randomUUID } from 'crypto';

export class CreateCreditCardUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute({ name, dueDay, closingDay, accountId }: CreateCreditCardDTO): Promise<CreditCard> {
    const cardAlreadyExists = await this.creditCardRepository.findByName(name, accountId);
    if (cardAlreadyExists) {
      throw new Error('Já existe um cartão de crédito com este nome.');
    }

    const creditCard = new CreditCard(randomUUID(), name, dueDay, closingDay, accountId);
    return this.creditCardRepository.create(creditCard);
  }
}