export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly accountId: string
  ) {}
}