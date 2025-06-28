import { IResponsibleRepository } from '../../domain/repositories/IResponsibleRepository';

export class DeleteResponsibleUseCase {
  constructor(private responsibleRepository: IResponsibleRepository) {}

  async execute(id: string, accountId: string): Promise<void> {
    const responsibleExists = await this.responsibleRepository.findById(id, accountId);

    if (!responsibleExists) {
        throw new Error('Responsável não encontrado ou não pertence a esta conta.');
    }

    await this.responsibleRepository.delete(id, accountId);
  }
}