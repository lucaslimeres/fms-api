export interface CreateExpenseDTO {
  accountId: string;
  description: string;
  amount: number;
  referenceDate: string; // YYYY-MM-DD
  categoryId: string;
  type: 'bill' | 'credit_card';
  responsibleId?: string; // Obrigatório se não for grupo
  groupId?: string; // Obrigatório se não for individual
  
  // Para contas (type = 'bill')
  billType?: 'fixed' | 'variable';
  
  // Para cartão (type = 'credit_card')
  cardId?: string;
  installments?: number; // Número de parcelas (1 para à vista)
}