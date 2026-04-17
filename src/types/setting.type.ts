import type { changePasswordSchema, setPasswordSchema, updateProfileSchema } from "@/validations/setting.validation";
import type z from "zod";
import type { UserType } from "./user.type";

export interface GetMeResponse {
  success: boolean;
  message: string | null;
  data: UserType & { hasPassword: boolean };
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

export interface SetPasswordResponse {
  success: boolean;
  message: string;
}

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
