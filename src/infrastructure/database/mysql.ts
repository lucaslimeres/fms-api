import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'sua_senha_forte_aqui', // **IMPORTANTE**: Troque pela sua senha
  database: 'financas_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;