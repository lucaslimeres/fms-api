import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { UpdateCategoryDTO } from '../dtos/UpdateCategoryDTO';

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({ id, name, accountId }: UpdateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findById(id, accountId);
    if (!category) {
      throw new Error('Categoria não encontrada ou não pertence a esta conta.');
    }

    const categoryNameExists = await this.categoryRepository.findByName(name, accountId);
    if (categoryNameExists && categoryNameExists.id !== id) {
        throw new Error('Já existe uma categoria com este nome.');
    }

    category.name = name;
    return this.categoryRepository.update(category);
  }
}