import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { InvoiceController } from '../controllers/InvoiceController';

const invoiceRoutes = Router();
const invoiceController = new InvoiceController();

invoiceRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

invoiceRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
  await invoiceController.list(req, res);
}));

export { invoiceRoutes };