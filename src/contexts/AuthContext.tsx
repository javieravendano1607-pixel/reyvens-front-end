import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, type ApiUser } from "../services/auth";
import { onSessionExpired, setAccessToken } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

function mapUser(user: ApiUser): User {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void authApi.restore()
      .then(apiUser => { if (active) setUser(mapUser(apiUser)); })
      .catch(() => { if (active) { setAccessToken(null); setUser(null); } })
      .finally(() => { if (active) setIsLoading(false); });
    const unsubscribe = onSessionExpired(() => {
      if (active) setUser(null);
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const apiUser = await authApi.login(email, password);
      setUser(mapUser(apiUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: { name: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const apiUser = await authApi.register(input);
      setUser(mapUser(apiUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try { await authApi.logout(); }
    finally { setAccessToken(null); setUser(null); setIsLoading(false); }
  }, []);

  const value = useMemo(() => ({
    user, isAuthenticated: Boolean(user), isLoading, login, register, logout,
  }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
