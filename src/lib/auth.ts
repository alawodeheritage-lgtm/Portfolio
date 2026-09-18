const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
}

interface AuthResponse {
  admin: AuthenticatedAdmin;
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function loginAdmin(email: string, password: string): Promise<AuthenticatedAdmin> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Unable to sign in.'));
  }

  const body = (await response.json()) as AuthResponse;
  return body.admin;
}

export async function getCurrentAdmin(): Promise<AuthenticatedAdmin | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readError(response, 'Unable to verify the admin session.'));
  }

  const body = (await response.json()) as AuthResponse;
  return body.admin;
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Unable to sign out.'));
  }
}