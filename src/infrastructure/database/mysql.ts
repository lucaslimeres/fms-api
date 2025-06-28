import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root', // **IMPORTANTE**: Troque pela sua senha
  database: 'gefipe_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;