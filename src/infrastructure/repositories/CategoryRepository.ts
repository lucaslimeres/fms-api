import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import db from '../database/mysql';

export class CategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const sql = 'INSERT INTO categories (category_id, name, account_id) VALUES (?, ?, ?)';
    await db.query(sql, [category.id, category.name, category.accountId]);
    return category;
  }

  async update(category: Category): Promise<Category> {
    const sql = 'UPDATE categories SET name = ? WHERE category_id = ? AND account_id = ?';
    await db.query(sql, [category.name, category.id, category.accountId]);
    return category;
  }

  async delete(id: string, accountId: string): Promise<void> {
    const sql = 'DELETE FROM categories WHERE category_id = ? AND account_id = ?';
    await db.query(sql, [id, accountId]);
  }

  async findById(id: string, accountId: string): Promise<Category | null> {
    const sql = 'SELECT * FROM categories WHERE category_id = ? AND account_id = ?';
    const [rows]: any[] = await db.query(sql, [id, accountId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Category(row.category_id, row.name, row.account_id);
  }
  
  async findByName(name: string, accountId: string): Promise<Category | null> {
    const sql = 'SELECT * FROM categories WHERE name = ? AND account_id = ?';
    const [rows]: any[] = await db.query(sql, [name, accountId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Category(row.category_id, row.name, row.account_id);
  }

  async findAllByAccountId(accountId: string): Promise<Category[]> {
    const sql = 'SELECT * FROM categories WHERE account_id = ? ORDER BY name ASC';
    const [rows]: any[] = await db.query(sql, [accountId]);
    return rows.map((row: any) => new Category(row.category_id, row.name, row.account_id));
  }
}