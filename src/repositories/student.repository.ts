import { pool } from "../db/pool.js";
import type { Student, StudentInput } from "../types/student.js";

interface StudentRow {
  id: number;
  first_name: string;
  last_name: string;
  age: number | null;
}

function mapRow(row: StudentRow): Student {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
  };
}

export const studentRepository = {
  async getAll(): Promise<Student[]> {
    const result = await pool.query<StudentRow>("SELECT * FROM students ORDER BY id");
    return result.rows.map(mapRow);
  },

  async getById(id: number): Promise<Student | null> {
    const result = await pool.query<StudentRow>("SELECT * FROM students WHERE id = $1", [id]);
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },

  async create(data: StudentInput): Promise<Student> {
    const result = await pool.query<StudentRow>(
      "INSERT INTO students (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *",
      [data.firstName, data.lastName, data.age ?? null]
    );
    return mapRow(result.rows[0]!);
  },

  async updateFull(id: number, data: StudentInput): Promise<Student | null> {
    const result = await pool.query<StudentRow>(
      "UPDATE students SET first_name = $1, last_name = $2, age = $3 WHERE id = $4 RETURNING *",
      [data.firstName, data.lastName, data.age ?? null, id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  },

  async updatePartial(id: number, data: Partial<StudentInput>): Promise<Student | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const merged: StudentInput = {
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      age: data.age ?? existing.age,
    };

    return this.updateFull(id, merged);
  },

  async remove(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
