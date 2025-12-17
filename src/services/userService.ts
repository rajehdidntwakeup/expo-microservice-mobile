import { UserData } from '../types';
import { storage } from '../utils/storage';
import { API_BASE_URL } from '../utils/api';

export async function getUsers(): Promise<UserData[]> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error('Failed to load users');
  }

  const data = await resp.json();
  return (data || []).map((d: any) => ({
    id: d.id,
    name: d.username ?? d.name,
    role: normalizeRole(d.role),
  }));
}

export async function updateUserRole(id: number, newRole: string): Promise<UserData> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/users/${id}/role/${newRole}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    let txt = '';
    try {
      txt = await resp.text();
    } catch {}
    throw new Error(`Failed to update user (${resp.status}) ${txt}`);
  }

  return await resp.json();
}

export async function deleteUser(id: number): Promise<boolean> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    let txt = '';
    try {
      txt = await resp.text();
    } catch {}
    throw new Error(`Failed to delete user (${resp.status}) ${txt}`);
  }

  return true;
}

export const normalizeRole = (role: string): UserData['role'] => {
  return role === 'ROLE_WRITE' ? 'admin' : 'viewer';
};
