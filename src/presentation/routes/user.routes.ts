import { Router } from 'express';

const userRoutes = Router();

// Por enquanto, uma rota de exemplo
userRoutes.get('/', (req, res) => {
  res.status(200).json({ message: 'Rota de usuários funcionando!' });
});

export { userRoutes };