import { Request, Response } from 'express';
import { ResponsibleGroupRepository } from '../../infrastructure/repositories/ResponsibleGroupRepository';
import { ResponsibleRepository } from '../../infrastructure/repositories/ResponsibleRepository';
import { CreateResponsibleGroupUseCase } from '../../application/use-cases/CreateResponsibleGroupUseCase';
import { ListResponsibleGroupsUseCase } from '../../application/use-cases/ListResponsibleGroupsUseCase';
import { AddMemberToGroupUseCase } from '../../application/use-cases/AddMemberToGroupUseCase';
import { RemoveMemberFromGroupUseCase } from '../../application/use-cases/RemoveMemberFromGroupUseCase';
import { UpdateResponsibleGroupUseCase } from '../../application/use-cases/UpdateResponsibleGroupUseCase';
import { DeleteResponsibleGroupUseCase } from '../../application/use-cases/DeleteResponsibleGroupUseCase';


export class ResponsibleGroupController {
    async create(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;
        const { accountId } = req.user;
        const groupRepository = new ResponsibleGroupRepository();
        const useCase = new CreateResponsibleGroupUseCase(groupRepository);
        const group = await useCase.execute({ name, accountId });
        return res.status(201).json(group);
    }

    async list(req: Request, res: Response): Promise<Response> {
        const { accountId } = req.user;
        const groupRepository = new ResponsibleGroupRepository();
        const useCase = new ListResponsibleGroupsUseCase(groupRepository);
        const groups = await useCase.execute(accountId);
        return res.json(groups);
    }

    async addMember(req: Request, res: Response): Promise<Response> {
        const { groupId } = req.params;
        const { responsibleId, weight } = req.body;
        const { accountId } = req.user;

        const groupRepository = new ResponsibleGroupRepository();
        const responsibleRepository = new ResponsibleRepository();
        const useCase = new AddMemberToGroupUseCase(groupRepository, responsibleRepository);
        
        await useCase.execute({ groupId, responsibleId, weight, accountId });
        return res.status(204).send();
    }

    async removeMember(req: Request, res: Response): Promise<Response> {
        const { groupId, memberId } = req.params;
        const { accountId } = req.user;
        
        const groupRepository = new ResponsibleGroupRepository();
        const useCase = new RemoveMemberFromGroupUseCase(groupRepository);
        
        await useCase.execute(groupId, memberId, accountId);
        return res.status(204).send();
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;
        const { accountId } = req.user;
        const groupRepository = new ResponsibleGroupRepository();
        const useCase = new UpdateResponsibleGroupUseCase(groupRepository);
        const group = await useCase.execute(id, name, accountId);
        return res.json(group);
    }
    
    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { accountId } = req.user;
        const groupRepository = new ResponsibleGroupRepository();
        const useCase = new DeleteResponsibleGroupUseCase(groupRepository);
        await useCase.execute(id, accountId);
        return res.status(204).send();
    }
}