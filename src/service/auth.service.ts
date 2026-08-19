import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repository/user.repository.js";
import type { UserLoginInput, UserRegisterInput } from "../model/user.model.js";
import { ApiError } from "../errors/api-error.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = "1h";
const SALT_ROUNDS = 10;

export const authService = {
  async register(data: UserRegisterInput): Promise<{ id: number; email: string; role: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await userRepository.create(data.email, passwordHash, data.role ?? "user");

    return { id: user.id, email: user.email, role: user.role };
  },

  async login(data: UserLoginInput): Promise<string> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  },
};
