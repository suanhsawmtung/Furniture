import type { UserFilterFormSchema, userSchema } from "@/validations/user.validation";
import type z from "zod";

// Role enum from backend
export type Role = "USER" | "ADMIN" | "AUTHOR";

// Status enum from backend
export type Status = "ACTIVE" | "INACTIVE" | "FREEZE";

export interface UserType {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: Role;
  status: Status;
  lastLogin: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResult {
  users: UserType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface UserQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserType;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserType;
  };
}

export interface DeleteUserParams {
  username: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export type UserFormValues = z.infer<typeof userSchema>;

export type UserFilterFormValues = z.infer<typeof UserFilterFormSchema>;