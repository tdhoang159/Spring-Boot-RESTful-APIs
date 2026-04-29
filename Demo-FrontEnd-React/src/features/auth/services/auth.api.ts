import axiosInstance from "../../attendee/lib/axios";
import type { AuthSession } from "./auth-session.service";

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

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: "ATTENDEE" | "ORGANIZER";
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

export const registerAPI = async (payload: RegisterPayload): Promise<void> => {
  await axiosInstance.post("/api/auth/register", payload);
};
