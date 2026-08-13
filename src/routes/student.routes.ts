import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { studentRepository } from "../repositories/student.repository.js";
import { ApiError } from "../errors/api-error.js";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await studentRepository.getAll();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const student = await studentRepository.getById(id);

    if (!student) {
      return next(new ApiError(404, `Student with id ${id} not found`));
    }

    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, age } = req.body;

    if (!firstName || !lastName) {
      return next(new ApiError(400, "'firstName' and 'lastName' fields are required"));
    }

    const student = await studentRepository.create({ firstName, lastName, age });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, age } = req.body;

    if (!firstName || !lastName) {
      return next(new ApiError(400, "'firstName' and 'lastName' fields are required for PUT"));
    }

    const updated = await studentRepository.updateFull(id, { firstName, lastName, age });

    if (!updated) {
      return next(new ApiError(404, `Student with id ${id} not found`));
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updated = await studentRepository.updatePartial(id, req.body);

    if (!updated) {
      return next(new ApiError(404, `Student with id ${id} not found`));
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await studentRepository.remove(id);

    if (!deleted) {
      return next(new ApiError(404, `Student with id ${id} not found`));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
