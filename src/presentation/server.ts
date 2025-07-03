import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'; 
import 'express-async-handler';
import db from '../infrastructure/database/mysql';
import { userRoutes } from './routes/user.routes';
import { responsibleRoutes } from './routes/responsible.routes';
import { responsibleGroupRoutes } from './routes/responsibleGroup.routes';
import { categoryRoutes } from './routes/category.routes';
import { creditCardRoutes } from './routes/creditCard.routes';
import { expenseRoutes } from './routes/expense.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { invoiceRoutes } from './routes/invoice.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>API Finanças+ (TypeScript + Clean Architecture)</h1>');
});

app.get('/test-db', async (req, res) => {
  try {
    const [results] = await db.query('SELECT NOW() as data_hora_atual;');
    res.status(200).json({
      success: true,
      message: 'Conexão com o banco de dados bem-sucedida!',
      data: results
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    res.status(500).json({ success: false, message: 'Falha ao conectar.' });
  }
});

app.use('/users', userRoutes);
app.use('/responsibles', responsibleRoutes); 
app.use('/groups', responsibleGroupRoutes);
app.use('/categories', categoryRoutes);
app.use('/credit-cards', creditCardRoutes);
app.use('/expenses', expenseRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/invoices', invoiceRoutes);

// NOVO: Middleware de tratamento de erros.
// Deve ser o último middleware a ser adicionado.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log do erro para debugging
  // Retorna uma resposta de erro, usando a mensagem do erro lançado.
  res.status(400).json({ message: err.message || 'Ocorreu um erro inesperado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});