import type { UserType } from "./user.type";
import type { changePasswordSchema, updateProfileSchema } from "@/validations/setting.validation";
import type z from "zod";

export interface GetMeResponse {
  success: boolean;
  message: string | null;
  data: UserType;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserType;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
