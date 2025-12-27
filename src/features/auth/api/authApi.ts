import { storage } from '@/shared/lib/storage';
import { API_BASE_URL } from '@/shared/config/api';

export interface LoginResponse {
  token?: string;
  admin?: boolean;
}

export interface RegisterResponse {
  token?: string;
  admin?: boolean;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && (data.message || data.error)) {
        message = data.message || data.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const ct = response.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await response.text().catch(() => '');
    throw new Error(`Login expected JSON but got ${ct}: ${text.slice(0, 300)}`);
  }
  const data: any = await response.json();

  // Save token and admin status
  if (data && data.token) {
    await storage.setToken(data.token);
  }

  if (data && data.admin) {
    await storage.setIsAdmin(data.admin);
  } else {
    await storage.removeIsAdmin();
  }

  await storage.setUsername(username);

  return data;
}

export async function register(username: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && (data.message || data.error)) {
        message = data.message || data.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const data: any = await response.json();

  // Save token and admin status
  if (data && typeof data.token !== 'undefined') {
    await storage.setToken(data.token);
  }

  if (data && typeof data.admin !== 'undefined') {
    await storage.setIsAdmin(!!data.admin);
  }

  await storage.setUsername(username);

  return data;
}

export async function logout(): Promise<void> {
  await storage.clearAll();
}
