export class CreditCard {
  constructor(
    public readonly id: string,
    public name: string,
    public dueDay: number,
    public closingDay: number,
    public readonly accountId: string
  ) {}
}