import { CreditCard } from '../../domain/entities/CreditCard';
import { ICreditCardRepository } from '../../domain/repositories/ICreditCardRepository';
import { UpdateCreditCardDTO } from '../dtos/UpdateCreditCardDTO';

export class UpdateCreditCardUseCase {
  constructor(private creditCardRepository: ICreditCardRepository) {}

  async execute({ id, name, dueDay, closingDay, accountId }: UpdateCreditCardDTO): Promise<CreditCard> {
    const creditCard = await this.creditCardRepository.findById(id, accountId);
    if (!creditCard) {
      throw new Error('Cartão de crédito não encontrado ou não pertence a esta conta.');
    }

    const cardNameExists = await this.creditCardRepository.findByName(name, accountId);
    if (cardNameExists && cardNameExists.id !== id) {
        throw new Error('Já existe um cartão de crédito com este nome.');
    }

    creditCard.name = name;
    creditCard.dueDay = dueDay;
    creditCard.closingDay = closingDay;
    
    return this.creditCardRepository.update(creditCard);
  }
}