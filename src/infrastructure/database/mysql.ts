import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'mDbNCFOlfnQQJOossjCKqtJgEbQyynNg',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;