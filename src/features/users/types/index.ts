import { z } from "zod";

export const userSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "supervisor", "operator"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type User = z.infer<typeof userSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
  passwordChangeRequired: boolean;
};

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
