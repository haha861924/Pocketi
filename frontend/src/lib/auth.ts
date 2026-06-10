import { api } from './api';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function register(email: string, password: string): Promise<string> {
  const data = await api.post<TokenResponse>('/api/auth/register', { email, password });
  localStorage.setItem('pocketit_token', data.access_token);
  return data.access_token;
}

export async function login(email: string, password: string): Promise<string> {
  const data = await api.post<TokenResponse>('/api/auth/login', { email, password });
  localStorage.setItem('pocketit_token', data.access_token);
  return data.access_token;
}

export function logout(): void {
  localStorage.removeItem('pocketit_token');
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('pocketit_token');
}
