import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ResponsibleGroupController } from '../controllers/ResponsibleGroupController';

const responsibleGroupRoutes = Router();
const groupController = new ResponsibleGroupController();

responsibleGroupRoutes.use(async (req: Request, res: Response, next: NextFunction) => {
    await ensureAuthenticated(req, res, next);
});

responsibleGroupRoutes.post('/', asyncHandler(async (req: Request, res: Response) => {
    await groupController.create(req, res);
}));

responsibleGroupRoutes.get('/', asyncHandler(async (req: Request, res: Response) => {
    await groupController.list(req, res);
}));

responsibleGroupRoutes.post('/:groupId/members', asyncHandler(async (req: Request, res: Response) => {
    await groupController.addMember(req, res);
}));

responsibleGroupRoutes.delete('/:groupId/members/:memberId', asyncHandler(async (req: Request, res: Response) => {
    await groupController.removeMember(req, res);
}));

responsibleGroupRoutes.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    await groupController.update(req, res);
}));

responsibleGroupRoutes.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    await groupController.delete(req, res);
}));

export { responsibleGroupRoutes };