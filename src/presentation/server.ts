import express from 'express';
import db from '../infrastructure/database/mysql';
import { userRoutes } from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('<h1>API Finanças+ (TypeScript + Clean Architecture)</h1>');
});

// Rota para testar a conexão com o banco
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

// Agrupa todas as rotas de usuário sob o prefixo /users
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
