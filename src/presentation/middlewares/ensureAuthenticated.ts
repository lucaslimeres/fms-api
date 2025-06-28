import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
  accountId: string;
  role: 'admin' | 'user';
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // 1. Receber o token do cabeçalho da requisição
  const authToken = request.headers.authorization;

  // 2. Validar se o token não existe
  if (!authToken) {
    return response.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // O token vem no formato "Bearer token_string". Precisamos separar.
  const [, token] = authToken.split(' ');

  try {
    // 3. Validar se o token é válido
    const { sub: userId, accountId, role } = verify(
      token,
      'sua_chave_secreta_aqui' // A mesma chave secreta usada no login
    ) as IPayload;

    // 4. Injetar as informações do usuário (id, accountId, role) no objeto `request`
    request.user = {
      id: userId,
      accountId,
      role,
    };

    return next(); // Se tudo estiver certo, permite que a requisição continue
  } catch {
    // 5. Se o token for inválido, retorna um erro
    return response.status(401).json({ message: 'Token inválido.' });
  }
}
