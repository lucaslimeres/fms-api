import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { CreditCardController } from '../controllers/CreditCardController';

const creditCardRoutes = Router();
const creditCardController = new CreditCardController();

creditCardRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

creditCardRoutes.post('/', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.create(req, res);
}));

creditCardRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.list(req, res);
}));

creditCardRoutes.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.update(req, res);
}));

creditCardRoutes.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.delete(req, res);
}));

creditCardRoutes.get('/faturas', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.getFaturas(req, res);
}));

creditCardRoutes.patch('/:id/pay-fatura', asyncHandler(async (req: Request, res: Response) => {
    await creditCardController.payFatura(req, res);
}));

export { creditCardRoutes };