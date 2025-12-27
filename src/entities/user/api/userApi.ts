import { User, normalizeRole } from '../model/types';
import { storage } from '@/shared/lib/storage';
import { API_BASE_URL } from '@/shared/config/api';

export async function getUsers(): Promise<User[]> {
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

export async function updateUserRole(id: number, newRole: string): Promise<User> {
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
