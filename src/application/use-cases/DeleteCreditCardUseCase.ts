import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';

export class DeleteCreditCardUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute(id: string, accountId: string): Promise<void> {
    const cardExists = await this.creditCardRepository.findById(id, accountId);
    if (!cardExists) {
      throw new Error('Cartão de crédito não encontrado ou não pertence a esta conta.');
    }
    // Adicionar validação para não permitir deletar se houver despesas associadas.
    await this.creditCardRepository.delete(id, accountId);
  }
}