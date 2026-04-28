export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";
const AUTH_CHANGED_EVENT = "auth-changed";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthSession = (session: AuthSession) => {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  notifyAuthChanged();
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChanged();
};

export const getAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const updateAuthUser = (patch: Partial<AuthUser>) => {
  const currentUser = getAuthUser();
  if (!currentUser) return;

  const nextUser: AuthUser = {
    ...currentUser,
    ...patch,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  notifyAuthChanged();
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};

export const subscribeAuthChange = (callback: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGED_EVENT, callback);
};