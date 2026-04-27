import axiosInstance from "../lib/axios";
import type { AuthSession } from "../lib/auth";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

interface RawAuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const mapAuthResponse = (response: RawAuthResponse): AuthSession => ({
  accessToken: response.accessToken,
  tokenType: response.tokenType,
  user: {
    userId: response.userId,
    email: response.email,
    fullName: response.fullName,
    role: response.role,
  },
});

export const loginAPI = async (payload: LoginPayload): Promise<AuthSession> => {
  const res = await axiosInstance.post<ApiResponse<RawAuthResponse>>("/api/auth/login", payload);
  return mapAuthResponse(res.data.data);
};
