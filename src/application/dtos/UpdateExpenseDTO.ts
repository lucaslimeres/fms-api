export interface UpdateExpenseDTO {
  id: string;
  accountId: string;
  description?: string;
  amount?: number;
  referenceDate?: string;
  referenceMonthYear?: string;
  categoryId?: string;
  responsibleId?: string;
  billType?: 'fixed' | 'variable';
  cardId?: string;
}