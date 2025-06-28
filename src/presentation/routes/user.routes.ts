import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await userController.create(req, res);
  })
);

userRoutes.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    await userController.authenticate(req, res);
  })
);

userRoutes.get(
    '/profile', 
    async (req: Request, res: Response, next: NextFunction) => {
        await ensureAuthenticated(req, res, next);
    }, 
    asyncHandler(async (req: Request, res: Response) => {
        await userController.profile(req, res);
    })
);


export { userRoutes };