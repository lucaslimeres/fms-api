declare namespace Express {
  export interface Request {
    user: {
      id: string;
      accountId: string;
      role: 'admin' | 'user';
    };
  }
}