import { Responsible } from '../../domain/entities/Responsible';
import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';
import { CreateResponsibleDTO } from '../dtos/CreateResponsibleDTO';
import { randomUUID } from 'crypto';

export class CreateResponsibleUseCase {
  constructor(private responsibleRepository: IResponsibleRepository) {}

  async execute({ name, accountId }: CreateResponsibleDTO): Promise<Responsible> {
    const responsible = new Responsible(randomUUID(), name, accountId, true);
    return this.responsibleRepository.create(responsible);
  }
}