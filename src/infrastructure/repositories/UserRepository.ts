import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import db from '../database/mysql';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows]: any[] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    const userData = rows[0];
    return new User(userData.user_id, userData.name, userData.email, userData.role, userData.account_id, userData.password_hash);
  }

  async findById(id: string): Promise<User | null> {
    const [rows]: any[] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (rows.length === 0) return null;
    const userData = rows[0];
    return new User(userData.user_id, userData.name, userData.email, userData.role, userData.account_id, userData.password_hash);
  }

  async save(user: User): Promise<void> {
    const sql = `INSERT INTO users (user_id, name, email, role, account_id, password_hash) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [user.id, user.name, user.email, user.role, user.accountId, user.passwordHash]);
  }

  async findAllByAccountId(accountId: string): Promise<User[]> {
    const [rows]: any[] = await db.query('SELECT user_id, name, email, role FROM users WHERE account_id = ?', [accountId]);
    return rows;
  }

  async delete(id: string): Promise<void> {
    await db.query('DELETE FROM users WHERE user_id = ?', [id]);
  }
}