import { CreditCard } from '../../domain/entities/CreditCard';
import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';

export class ListCreditCardsUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute(accountId: string): Promise<CreditCard[]> {
    return this.creditCardRepository.findAllByAccountId(accountId);
  }
}