export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: 'admin' | 'user',
    public readonly accountId: string,
    public passwordHash: string
  ) {}
}