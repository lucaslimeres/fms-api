import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { CategoryController } from '../controllers/CategoryController';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

categoryRoutes.post('/', asyncHandler(async (req: Request, res: Response) => {
    await categoryController.create(req, res);
}));

categoryRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
    await categoryController.list(req, res);
}));

categoryRoutes.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    await categoryController.update(req, res);
}));

categoryRoutes.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    await categoryController.delete(req, res);
}));

export { categoryRoutes };