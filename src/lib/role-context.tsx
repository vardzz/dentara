'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'student' | 'patient';

interface RoleContextValue {
  role: UserRole;
  setRole: (r: UserRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = 'dentara_role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('student');

  // Hydrate from localStorage (client-only) to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (stored === 'student' || stored === 'patient') {
      setRoleState(stored);
    }
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    localStorage.setItem(STORAGE_KEY, r);
  }, []);

  const toggleRole = useCallback(() => {
    setRole(role === 'student' ? 'patient' : 'student');
  }, [role, setRole]);

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}
