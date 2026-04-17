import type { UserFilterFormSchema, userSchema } from "@/validations/user.validation";
import type z from "zod";

// Role enum from backend
export type Role = "USER" | "ADMIN" | "AUTHOR";

// Status enum from backend
export type Status = "ACTIVE" | "INACTIVE" | "FREEZE";

// AuthProvider enum from backend
export type AuthProvider = "EMAIL" | "GOOGLE";

export interface UserType {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: Role;
  status: Status;
  emailVerifiedAt: string | Date | null;
  provider: AuthProvider;
  image: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserListResult {
  items: UserType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface CommonUserType {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
}

export interface CommonUserResult {
  items: CommonUserType[];
  nextCursor: number | null;
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
  data: UserType;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: UserType;
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