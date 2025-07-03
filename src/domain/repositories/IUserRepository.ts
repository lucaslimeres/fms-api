import { User } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>; // Adicionado para validação
  save(user: User): Promise<void>;
  findAllByAccountId(accountId: string): Promise<User[]>; // NOVO
  delete(id: string): Promise<void>; // NOVO
}