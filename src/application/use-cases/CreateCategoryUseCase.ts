import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CreateCategoryDTO } from '../dtos/CreateCategoryDTO';
import { randomUUID } from 'crypto';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({ name, accountId }: CreateCategoryDTO): Promise<Category> {
    const categoryAlreadyExists = await this.categoryRepository.findByName(name, accountId);
    if (categoryAlreadyExists) {
      throw new Error('Já existe uma categoria com este nome.');
    }

    const category = new Category(randomUUID(), name, accountId);
    return this.categoryRepository.create(category);
  }
}