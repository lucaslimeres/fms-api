export interface ListExpensesDTO {
  accountId: string;
  monthYear: string; // Formato YYYY-MM
  responsibleId?: string;
  groupId?: string;
  cardId?: string;
}