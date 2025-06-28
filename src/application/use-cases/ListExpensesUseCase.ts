import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { ListExpensesDTO } from '../dtos/ListExpensesDTO';

export class ListExpensesUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(filter: ListExpensesDTO): Promise<any[]> {
    // A lógica complexa de cálculo de peso de grupos pode ser adicionada aqui no futuro.
    // Por agora, o caso de uso simplesmente repassa os filtros para o repositório.
    return this.expenseRepository.findAll(filter);
  }
}