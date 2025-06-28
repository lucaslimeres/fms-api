export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  accountId: string; // Em um cenário real, isso poderia vir de um cadastro de conta
  role: 'admin' | 'user';
}