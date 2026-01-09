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
