'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'student' | 'patient' | 'university';

/** Minimal user shape returned from login — used for global auth state */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

interface RoleContextValue {
  role: UserRole;
  user: AuthUser | null;
  setRole: (r: UserRole) => void;
  setUser: (u: AuthUser | null) => void;
  /** Called after successful login — updates role + user from API response */
  setAuth: (role: UserRole, user: AuthUser) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = 'dentara_role';
const USER_STORAGE_KEY = 'dentara_user';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('student');
  const [user, setUserState] = useState<AuthUser | null>(null);

  // Hydrate from localStorage (client-only) to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (stored === 'student' || stored === 'patient' || stored === 'university') {
      setRoleState(stored);
    }
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (u) setUserState(JSON.parse(u));
    } catch {
      /* ignore */
    }
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    localStorage.setItem(STORAGE_KEY, r);
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const setAuth = useCallback((r: UserRole, u: AuthUser) => {
    setRoleState(r);
    setUserState(u);
    localStorage.setItem(STORAGE_KEY, r);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
  }, []);

  const toggleRole = useCallback(() => {
    const next = role === 'student' ? 'patient' : role === 'patient' ? 'university' : 'student';
    setRole(next);
  }, [role, setRole]);

  return (
    <RoleContext.Provider value={{ role, user, setRole, setUser, setAuth, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}
