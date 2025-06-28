import { Request, Response } from 'express';
import { ResponsibleRepository } from '../../infrastructure/repositories/ResponsibleRepository';
import { CreateResponsibleUseCase } from '../../application/use-cases/CreateResponsibleUseCase';
import { ListResponsiblesUseCase } from '../../application/use-cases/ListResponsiblesUseCase';
import { UpdateResponsibleUseCase } from '../../application/use-cases/UpdateResponsibleUseCase';
import { DeleteResponsibleUseCase } from '../../application/use-cases/DeleteResponsibleUseCase';

export class ResponsibleController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const { accountId } = req.user;

    const responsibleRepository = new ResponsibleRepository();
    const createResponsibleUseCase = new CreateResponsibleUseCase(responsibleRepository);

    const responsible = await createResponsibleUseCase.execute({ name, accountId });

    return res.status(201).json(responsible);
  }

  async list(req: Request, res: Response): Promise<Response> {
    const { accountId } = req.user;

    const responsibleRepository = new ResponsibleRepository();
    const listResponsiblesUseCase = new ListResponsiblesUseCase(responsibleRepository);

    const responsibles = await listResponsiblesUseCase.execute(accountId);

    return res.json(responsibles);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name } = req.body;
    const { accountId } = req.user;

    const responsibleRepository = new ResponsibleRepository();
    const updateResponsibleUseCase = new UpdateResponsibleUseCase(responsibleRepository);

    const responsible = await updateResponsibleUseCase.execute({ id, name, accountId });

    return res.json(responsible);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { accountId } = req.user;

    const responsibleRepository = new ResponsibleRepository();
    const deleteResponsibleUseCase = new DeleteResponsibleUseCase(responsibleRepository);

    await deleteResponsibleUseCase.execute(id, accountId);

    return res.status(204).send();
  }
}
