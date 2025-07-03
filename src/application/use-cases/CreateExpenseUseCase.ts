import { Expense } from '../../domain/entities/Expense';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { CreateExpenseDTO } from '../dtos/CreateExpenseDTO';
import { randomUUID } from 'crypto';

export class CreateExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {
    // Aqui também injetaríamos os outros repositórios (categoria, responsável, etc.)
    // para validar a existência dos IDs recebidos.
  }

  async execute(data: CreateExpenseDTO): Promise<void> {
    if (!data.responsibleId && !data.groupId) {
      throw new Error('A despesa deve ser atribuída a um responsável ou a um grupo.');
    }

    if (data.type === 'bill') {
      const expense = new Expense(
        randomUUID(), data.accountId, data.categoryId, data.description, data.amount,
        new Date(data.referenceDate), data.referenceMonthYear,
        'bill', 'pending', data.responsibleId, data.groupId, data.billType
      );
      await this.expenseRepository.create(expense);
    } else if (data.type === 'credit_card') {
      if (!data.cardId) throw new Error('O cartão de crédito é obrigatório para este tipo de despesa.');
      
      const totalInstallments = data.installments || 1;
      const installmentAmount = parseFloat((data.amount / totalInstallments).toFixed(2));
      const installmentGroupId = totalInstallments > 1 ? randomUUID() : undefined;

      const expenses: Expense[] = [];
      const purchaseDate = new Date(data.referenceDate);

      for (let i = 1; i <= totalInstallments; i++) {
        const initialFaturaDate = new Date(`${data.referenceMonthYear}-02`); // Usar dia 2 para evitar bugs de fuso
        const faturaDate = new Date(initialFaturaDate.getFullYear(), initialFaturaDate.getMonth() + (i - 1), 2);
        const faturaMonthYear = `${faturaDate.getFullYear()}-${(faturaDate.getMonth() + 1).toString().padStart(2, '0')}`;
        
        const expense = new Expense(
            randomUUID(), data.accountId, data.categoryId, `${data.description} ${totalInstallments > 1 ? `(${i}/${totalInstallments})` : ''}`, 
            installmentAmount, purchaseDate, faturaMonthYear, // USA O VALOR CALCULADO
            'credit_card', 'pending', data.responsibleId, data.groupId, undefined, data.cardId,
            totalInstallments > 1, installmentGroupId, i, totalInstallments
        );
        expenses.push(expense);
      }
      
      if(expenses.length === 1) {
        await this.expenseRepository.create(expenses[0]);
      } else {
        await this.expenseRepository.createMany(expenses);
      }
    }
  }
}