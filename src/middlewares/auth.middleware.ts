import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import type { JwtPayload } from "../model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
