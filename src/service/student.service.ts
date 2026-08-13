import { studentRepository } from "../repository/student.repository.js";
import type { Student, StudentInput } from "../model/student.model.js";

export const studentService = {
  async getAll(): Promise<Student[]> {
    return studentRepository.getAll();
  },

  async getById(id: number): Promise<Student | null> {
    return studentRepository.getById(id);
  },

  async create(data: StudentInput): Promise<Student> {
    return studentRepository.create(data);
  },

  async updateFull(id: number, data: StudentInput): Promise<Student | null> {
    return studentRepository.updateFull(id, data);
  },

  async updatePartial(id: number, data: Partial<StudentInput>): Promise<Student | null> {
    const existing = await studentRepository.getById(id);
    if (!existing) return null;

    const merged: StudentInput = {
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      age: data.age ?? existing.age,
    };

    return studentRepository.updateFull(id, merged);
  },

  async remove(id: number): Promise<boolean> {
    return studentRepository.remove(id);
  },
};
