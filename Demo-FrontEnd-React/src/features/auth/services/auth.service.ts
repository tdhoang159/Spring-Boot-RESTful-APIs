import { clearAuthSession, getAuthUser, setAuthSession } from "./auth-session.service";
import { loginAPI } from "./auth.api";

export type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export type AppUser = {
  fullName: string;
  email: string;
  role: UserRole;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

type UserRecord = AppUser & {
  password: string;
};

const USERS_KEY = "demo_users";

const loadUsers = (): UserRecord[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
};

const saveUsers = (users: UserRecord[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (input: RegisterInput): { ok: boolean; message: string } => {
  const users = loadUsers();
  const existed = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());

  if (existed) {
    return { ok: false, message: "Email already exists" };
  }

  const newUser: UserRecord = {
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    role: input.role,
  };

  users.push(newUser);
  saveUsers(users);

  return { ok: true, message: "Register successful" };
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
    return "/attendee";
  }

  return "/";
};
