"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

const TOKEN_KEY = "lumin-admin-token";

type AdminAuthContextType = {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
  getHeaders: () => HeadersInit;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    setToken(t);
    if (t) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => setEmail(d.email))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        });
    }
    setReady(true);
  }, []);

  const setAuth = useCallback((t: string, e: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setEmail(e);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setEmail(null);
  }, []);

  const getHeaders = useCallback((): HeadersInit => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ token, email, setAuth, logout, getHeaders }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
