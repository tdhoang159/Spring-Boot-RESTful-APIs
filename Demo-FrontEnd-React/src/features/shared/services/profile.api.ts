import axiosInstance from "../../attendee/lib/axios";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export interface UserProfile {
  email: string;
  avatarUrl: string | null;
  fullName: string;
  phone: string | null;
}

export interface UpdateUserProfilePayload {
  fullName: string;
  phone: string;
  avatar?: File | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const getMyProfileAPI = async (): Promise<UserProfile> => {
  const res = await axiosInstance.get<ApiResponse<UserProfile>>("/api/users/me/profile");
  return res.data.data;
};

export const updateMyProfileAPI = async (payload: UpdateUserProfilePayload): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("phone", payload.phone);
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  const res = await axiosInstance.put<ApiResponse<UserProfile>>(
    "/api/users/me/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.data;
};

export const changeMyPasswordAPI = async (payload: ChangePasswordPayload): Promise<void> => {
  await axiosInstance.patch<ApiResponse<void>>("/api/users/me/profile/password", payload);
};
