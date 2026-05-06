import { adminApiClient, unwrapApiData } from "./adminApiClient";
import type { ApiResponse, UserPayload, UserRecord } from "../types/admin.types";

export const ROLE_IDS = {
  ADMIN: 1,
  ORGANIZER: 2,
  ATTENDEE: 3,
} as const;

export const userApi = {
  async getUsers(): Promise<UserRecord[]> {
    const res = await adminApiClient.get<ApiResponse<UserRecord[]>>("/api/users");
    return unwrapApiData(res.data);
  },
  async getUser(id: number): Promise<UserRecord> {
    const res = await adminApiClient.get<ApiResponse<UserRecord>>(`/api/users/${id}`);
    return unwrapApiData(res.data);
  },
  async createUser(payload: UserPayload, avatar?: File | null): Promise<UserRecord> {
    if (avatar) {
      const formData = toUserFormData(payload, avatar);
      const res = await adminApiClient.post<ApiResponse<UserRecord>>("/api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return unwrapApiData(res.data);
    }

    const res = await adminApiClient.post<ApiResponse<UserRecord>>("/api/users", payload);
    return unwrapApiData(res.data);
  },
  async updateUser(id: number, payload: UserPayload, avatar?: File | null): Promise<UserRecord> {
    if (avatar) {
      const formData = toUserFormData(payload, avatar);
      const res = await adminApiClient.put<ApiResponse<UserRecord>>(`/api/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return unwrapApiData(res.data);
    }

    const res = await adminApiClient.put<ApiResponse<UserRecord>>(`/api/users/${id}`, payload);
    return unwrapApiData(res.data);
  },
  async deleteUser(id: number): Promise<void> {
    await adminApiClient.delete(`/api/users/${id}`);
  },
};

const toUserFormData = (payload: UserPayload, avatar: File): FormData => {
  const formData = new FormData();
  formData.append("roleId", String(payload.roleId));
  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.passwordHash) formData.append("passwordHash", payload.passwordHash);
  if (payload.status) formData.append("status", payload.status);
  formData.append("avatar", avatar);
  return formData;
};
