export const AUTH_TOKEN_KEY = "authToken";
export const USER_EMAIL_KEY = "userEmail";
export const USER_NAME_KEY = "userName";
export const USER_ID_KEY = "userId";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_ID_KEY);
}
