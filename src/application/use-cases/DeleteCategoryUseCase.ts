import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, accountId: string): Promise<void> {
    const categoryExists = await this.categoryRepository.findById(id, accountId);
    if (!categoryExists) {
      throw new Error('Categoria não encontrada ou não pertence a esta conta.');
    }
    await this.categoryRepository.delete(id, accountId);
  }
}