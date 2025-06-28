import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(accountId: string): Promise<Category[]> {
    return this.categoryRepository.findAllByAccountId(accountId);
  }
}