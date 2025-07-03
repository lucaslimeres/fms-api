export class Expense {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public categoryId: string,
    public description: string,
    public amount: number,
    public referenceDate: Date,
    public referenceMonthYear: string,
    public type: 'bill' | 'credit_card',
    public status: 'pending' | 'paid',

    // Relações e tipos
    public responsibleId?: string,
    public groupId?: string,
    public billType?: 'fixed' | 'variable',
    public cardId?: string,

    // Parcelamento
    public isInstallment?: boolean,
    public installmentGroupId?: string,
    public installmentNumber?: number,
    public installmentTotal?: number,

    // Pagamento
    public paymentDate?: Date
  ) {}
}
