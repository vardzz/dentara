'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { RoleProvider } from '@/lib/role-context';
import { NotificationProvider } from '@/lib/notification-context';

// ---------------------------------------------------------------------------
// Root App Layout
// ---------------------------------------------------------------------------
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RoleProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </RoleProvider>
    </SessionProvider>
  );
}

