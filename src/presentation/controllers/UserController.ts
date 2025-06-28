import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../../application/use-cases/AuthenticateUserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class UserController {
  async create(req: Request, res: Response): Promise<Response | void> {
    const { name, email, password, accountId, role } = req.body;
    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const user = await createUserUseCase.execute({ name, email, password, accountId, role });
    const { passwordHash, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  }

  async authenticate(req: Request, res: Response): Promise<Response | void> {
    const { email, password } = req.body;
    const userRepository = new UserRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    const response = await authenticateUserUseCase.execute({ email, password });
    return res.json(response);
  }
  
  // NOVO MÉTODO
  async profile(req: Request, res: Response): Promise<Response> {
    // Graças ao middleware, agora temos acesso a `req.user`
    const { id, accountId, role } = req.user;

    // Em um caso real, você poderia buscar mais dados do usuário no banco.
    // Aqui, apenas retornamos as informações injetadas pelo token.
    return res.json({
        message: 'Rota autenticada com sucesso!',
        user: {
            id,
            accountId,
            role
        }
    });
  }
}