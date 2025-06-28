import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ExpenseController } from '../controllers/ExpenseController';

const expenseRoutes = Router();
const expenseController = new ExpenseController();

expenseRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

expenseRoutes.post('/', asyncHandler(async (req: Request, res: Response) => {
    await expenseController.create(req, res);
}));

expenseRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
    await expenseController.list(req, res);
}));

expenseRoutes.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    await expenseController.update(req, res);
}));

expenseRoutes.patch('/:id/pay', asyncHandler(async (req: Request, res: Response) => {
    await expenseController.pay(req, res);
}));

expenseRoutes.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    await expenseController.delete(req, res);
}));

export { expenseRoutes };