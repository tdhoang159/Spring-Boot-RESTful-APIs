import { clearAuthSession, getAuthUser, setAuthSession } from "./auth-session.service";
import { loginAPI, registerAPI } from "./auth.api";

export type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export type AppUser = {
  fullName: string;
  email: string;
  role: UserRole;
};

export type RegisterRole = Exclude<UserRole, "ADMIN">;

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role: RegisterRole;
};

type LoginInput = {
  email: string;
  password: string;
};

export const register = async (input: RegisterInput): Promise<{ ok: boolean; message: string }> => {
  try {
    await registerAPI(input);
    return { ok: true, message: "Register successful" };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.response?.data?.message ?? "Register failed",
    };
  }
};

export const login = async (input: LoginInput): Promise<{ ok: boolean; message: string }> => {
  try {
    const session = await loginAPI(input);
    setAuthSession(session);
    return { ok: true, message: "Login successful" };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.response?.data?.message ?? "Invalid email or password",
    };
  }
};

export const getCurrentUser = (): AppUser | null => {
  const user = getAuthUser();
  if (!user) return null;

  return {
    fullName: user.fullName,
    email: user.email,
    role: user.role as UserRole,
  };
};

export const logout = () => {
  clearAuthSession();
};

export const getHomePathByRole = (role: UserRole): string => {
  if (role === "ORGANIZER") {
    return "/organizer";
  }

  if (role === "ATTENDEE") {
    return "/";
  }

  return "/admin";
};
