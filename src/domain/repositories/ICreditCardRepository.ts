import { CreditCard } from '../entities/CreditCard';

export interface ICreditCardRepository {
  create(creditCard: CreditCard): Promise<CreditCard>;
  update(creditCard: CreditCard): Promise<CreditCard>;
  delete(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<CreditCard | null>;
  findByName(name: string, accountId: string): Promise<CreditCard | null>;
  findAllByAccountId(accountId: string): Promise<CreditCard[]>;
  findFaturasByMonth(accountId: string, monthYear: string): Promise<any[]>;
  payFatura(cardId: string, accountId: string, monthYear: string): Promise<void>;
}