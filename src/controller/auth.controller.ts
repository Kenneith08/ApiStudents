import type { NextFunction, Request, Response } from "express";
import { authService } from "../service/auth.service.js";
import { ApiError } from "../errors/api-error.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return next(new ApiError(400, "'email' and 'password' fields are required"));
      }

      const user = await authService.register({ email, password, role });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ApiError(400, "'email' and 'password' fields are required"));
      }

      const token = await authService.login({ email, password });
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },
};
