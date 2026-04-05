import api from "@/lib/api";
import type {
    ChangePasswordFormValues,
    ChangePasswordResponse,
    GetMeResponse,
    UpdateProfileResponse
} from "@/types/setting.type";
import type { UserType } from "@/types/user.type";

export const getMe = async (): Promise<UserType> => {
  const response = await api.get<GetMeResponse>("/users/me");
  return response.data.data;
};

export const updateMe = async (formData: FormData): Promise<UpdateProfileResponse> => {
  const response = await api.patch<UpdateProfileResponse>("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const changePassword = async (data: ChangePasswordFormValues): Promise<ChangePasswordResponse> => {
  const response = await api.patch<ChangePasswordResponse>("/users/me/password", data);
  return response.data;
};
