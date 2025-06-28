import { Request, Response } from 'express';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';
import { CreateCategoryUseCase } from '../../application/use-cases/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '../../application/use-cases/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '../../application/use-cases/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../application/use-cases/DeleteCategoryUseCase';

export class CategoryController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const { accountId } = req.user;
    const categoryRepository = new CategoryRepository();
    const useCase = new CreateCategoryUseCase(categoryRepository);
    const category = await useCase.execute({ name, accountId });
    return res.status(201).json(category);
  }

  async list(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.user;
    const categoryRepository = new CategoryRepository();
    const useCase = new ListCategoriesUseCase(categoryRepository);
    const categories = await useCase.execute(accountId);
    return res.json(categories);
  }
  
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name } = req.body;
    const { accountId } = req.user;
    const categoryRepository = new CategoryRepository();
    const useCase = new UpdateCategoryUseCase(categoryRepository);
    const category = await useCase.execute({ id, name, accountId });
    return res.json(category);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { accountId } = req.user;
    const categoryRepository = new CategoryRepository();
    const useCase = new DeleteCategoryUseCase(categoryRepository);
    await useCase.execute(id, accountId);
    return res.status(204).send();
  }
}