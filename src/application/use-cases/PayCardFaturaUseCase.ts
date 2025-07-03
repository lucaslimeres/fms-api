import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';

export class PayCardFaturaUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute(cardId: string, accountId: string, monthYear: string): Promise<void> {
    // Validações (se o cartão existe, etc.) podem ser adicionadas aqui
    await this.creditCardRepository.payFatura(cardId, accountId, monthYear);
  }
}