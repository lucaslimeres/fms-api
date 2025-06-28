import { Responsible } from '../entities/Responsible';

export interface IResponsibleRepository {
  create(responsible: Responsible): Promise<Responsible>;
  update(responsible: Responsible): Promise<Responsible>;
  delete(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<Responsible | null>;
  findAllByAccountId(accountId: string): Promise<Responsible[]>;
}