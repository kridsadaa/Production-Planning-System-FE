import { z } from "zod";

export const loginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

import type { User } from "@/store/authStore";

export interface AuthResponse {
  accessToken: string;
  user: User;
}
