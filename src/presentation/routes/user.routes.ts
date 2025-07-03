import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const userController = new UserController();

// Rotas Públicas
userRoutes.post('/', asyncHandler(async (req: Request, res: Response) => {
    await userController.create(req, res);
}));
userRoutes.post('/login', asyncHandler(async (req: Request, res: Response) => {
    await userController.authenticate(req, res);
}));

// Rotas Protegidas
// userRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
//     await ensureAuthenticated(req, res, next);
// });

userRoutes.get(
    '/', 
    async (req: Request, res: Response, next: NextFunction) => {
        await ensureAuthenticated(req, res, next);
    }, 
    asyncHandler(async (req: Request, res: Response) => {
        await userController.list(req, res);
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

userRoutes.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        await ensureAuthenticated(req, res, next);
    },      
    asyncHandler(async (req: Request, res: Response) => {
        await userController.delete(req, res);
    })
);

export { userRoutes };