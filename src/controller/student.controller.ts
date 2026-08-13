import type { NextFunction, Request, Response } from "express";
import { studentService } from "../service/student.service.js";
import { ApiError } from "../errors/api-error.js";

export const studentController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await studentService.getAll();
      res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const student = await studentService.getById(id);

      if (!student) {
        return next(new ApiError(404, `Student with id ${id} not found`));
      }

      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName) {
        return next(new ApiError(400, "'firstName' and 'lastName' fields are required"));
      }

      const student = await studentService.create({ firstName, lastName, age });
      res.status(201).json(student);
    } catch (err) {
      next(err);
    }
  },

  async updateFull(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName) {
        return next(new ApiError(400, "'firstName' and 'lastName' fields are required for PUT"));
      }

      const updated = await studentService.updateFull(id, { firstName, lastName, age });

      if (!updated) {
        return next(new ApiError(404, `Student with id ${id} not found`));
      }

      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async updatePartial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await studentService.updatePartial(id, req.body);

      if (!updated) {
        return next(new ApiError(404, `Student with id ${id} not found`));
      }

      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await studentService.remove(id);

      if (!deleted) {
        return next(new ApiError(404, `Student with id ${id} not found`));
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
