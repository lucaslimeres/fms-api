export interface UpdateExpenseDTO {
  id: string;
  accountId: string;
  description?: string;
  amount?: number;
  referenceDate?: string;
  categoryId?: string;
}