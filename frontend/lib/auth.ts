export type Role = 'ROLE_ADMIN' | 'ROLE_STAFF';

export interface User {
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

const AUTH_TOKEN_KEY = 'vtea_token';
const AUTH_USER_KEY = 'vtea_user';

// Set cookie helper for client side so Next.js Middleware can read it
export function setAuthCookie(token: string, role: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 24 * 60 * 60; // 1 day
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

export function saveAuth(response: LoginResponse) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({ username: response.username, role: response.role })
  );
  setAuthCookie(response.token, response.role);
}

export function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  let user: User | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }
  return { token, user };
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  clearAuthCookie();
}

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Đăng nhập thất bại!');
  }

  const data: LoginResponse = await response.json();
  return data;
}

