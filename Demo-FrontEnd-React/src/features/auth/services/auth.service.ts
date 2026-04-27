export type UserRole = "ATTENDEE" | "ORGANIZER";

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
const CURRENT_USER_KEY = "demo_current_user";

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

export const login = (input: LoginInput): { ok: boolean; message: string } => {
  const users = loadUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
  );

  if (!found) {
    return { ok: false, message: "Invalid email or password" };
  }

  const currentUser: AppUser = {
    fullName: found.fullName,
    email: found.email,
    role: found.role,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  return { ok: true, message: "Login successful" };
};

export const getCurrentUser = (): AppUser | null => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getHomePathByRole = (role: UserRole): string => {
  return role === "ORGANIZER" ? "/portal/organizer" : "/portal/attendee";
};
