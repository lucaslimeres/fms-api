import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';

export class GetCardFaturasUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute(accountId: string, monthYear: string): Promise<any[]> {
    return this.creditCardRepository.findFaturasByMonth(accountId, monthYear);
  }
}