import api from "@/lib/api";
import type { CreateUserResponse, DeleteUserParams, DeleteUserResponse, UpdateUserResponse, UserListResult, UserQueryParams, UserType } from "@/types/user.type";

export const DEFAULT_LIMIT = 10;

export async function fetchUsers(options: {
  offset?: number;
  search?: string;
  limit?: number;
  role?: string;
  status?: string;
}): Promise<UserListResult> {
  const { offset = 0, search, limit = 10, role, status } = options;
  const queryParams: UserQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(role && { role }),
    ...(status && { status }),
  };

  const response = await api.get("/admin/users", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { users, currentPage, totalPages, pageSize }, message: null }
  return {
    users: response.data?.data?.users || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchUser(username: string): Promise<UserType> {
  const response = await api.get(`/admin/users/${username}`);

  // Backend returns: { success: true, data: { user }, message: null }
  return response.data?.data?.user;
}

export async function createUser(formData: FormData): Promise<CreateUserResponse> {
  const response = await api.post("/admin/users", formData);

  // Backend returns: { success: true, data: { user }, message: string }
  return response.data;
}

export async function updateUser(
  username: string,
  formData: FormData,
): Promise<UpdateUserResponse> {
  const response = await api.patch(`/admin/users/${username}`, formData);

  // Backend returns: { success: true, data: { user }, message: string }
  return response.data;
}

export async function deleteUser(
  params: DeleteUserParams,
): Promise<DeleteUserResponse> {
  const response = await api.delete(`/admin/users/${params.username}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}
