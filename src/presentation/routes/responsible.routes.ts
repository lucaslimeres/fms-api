import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ResponsibleController } from '../controllers/ResponsibleController';

const responsibleRoutes = Router();
const responsibleController = new ResponsibleController();

// Aplica o middleware de autenticação a TODAS as rotas deste arquivo
responsibleRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

responsibleRoutes.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await responsibleController.create(req, res);
  })
);

responsibleRoutes.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await responsibleController.list(req, res);
  })
);

responsibleRoutes.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await responsibleController.update(req, res);
  })
);

responsibleRoutes.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await responsibleController.delete(req, res);
  })
);

export { responsibleRoutes };