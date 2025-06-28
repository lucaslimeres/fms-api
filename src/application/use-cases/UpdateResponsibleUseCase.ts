import { Responsible } from '../../domain/entities/Responsible';
import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';
import { UpdateResponsibleDTO } from '../dtos/UpdateResponsibleDTO';

export class UpdateResponsibleUseCase {
  constructor(private responsibleRepository: IResponsibleRepository) {}

  async execute({ id, name, accountId }: UpdateResponsibleDTO): Promise<Responsible> {
    const responsible = await this.responsibleRepository.findById(id, accountId);

    if (!responsible) {
      throw new Error('Responsável não encontrado ou não pertence a esta conta.');
    }

    responsible.name = name;

    return this.responsibleRepository.update(responsible);
  }
}