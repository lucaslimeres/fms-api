import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { DashboardController } from '../controllers/DashboardController';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

dashboardRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
  await dashboardController.getSummary(req, res);
}));

export { dashboardRoutes };