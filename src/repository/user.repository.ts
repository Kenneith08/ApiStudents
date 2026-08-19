import { pool } from "../db/pool.js";
import type { User } from "../model/user.model.js";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

function mapRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
  };
}

export const userRepository = {
  async create(email: string, passwordHash: string, role: string): Promise<User> {
    const result = await pool.query<UserRow>(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *",
      [email, passwordHash, role]
    );
    return mapRow(result.rows[0]!);
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },

  async findById(id: number): Promise<User | null> {
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },
};
