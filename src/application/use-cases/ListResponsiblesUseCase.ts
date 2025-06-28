import { Responsible } from '../../domain/entities/Responsible';
import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';

export class ListResponsiblesUseCase {
  constructor(private responsibleRepository: IResponsibleRepository) {}

  async execute(accountId: string): Promise<Responsible[]> {
    return this.responsibleRepository.findAllByAccountId(accountId);
  }
}
