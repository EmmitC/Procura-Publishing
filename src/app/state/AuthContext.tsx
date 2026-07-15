import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { User } from './types';

const SEED_USERS: User[] = [
  { id: 'admin-1', name: 'Procura Admin', email: 'admin@procura.com', password: 'admin123', isAdmin: true },
  { id: 'user-emmit', name: 'Emmit Christopher', email: 'emmit@procura.com', password: 'emmit123', isAdmin: false },
];

interface AuthContextValue {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorageState<User[]>('procura_users', SEED_USERS);
  const [user, setUser] = useLocalStorageState<User | null>('procura_current_user', null);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    users,
    login: (email, password) => {
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found || found.password !== password) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      setUser(found);
      return { ok: true };
    },
    register: (name, email, password) => {
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      const newUser: User = { id: `user-${Date.now()}`, name, email, password };
      setUsers([...users, newUser]);
      setUser(newUser);
      return { ok: true };
    },
    logout: () => setUser(null),
  }), [user, users, setUser, setUsers]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
