import { Category } from '../entities/Category';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<Category | null>;
  findByName(name: string, accountId: string): Promise<Category | null>;
  findAllByAccountId(accountId: string): Promise<Category[]>;
}