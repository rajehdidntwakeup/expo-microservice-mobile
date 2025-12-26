export type UserRole = 'viewer' | 'admin';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export const normalizeRole = (role: string): UserRole => {
  return role === 'ROLE_WRITE' ? 'admin' : 'viewer';
};
