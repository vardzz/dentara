'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import { RoleProvider, useRole } from '@/lib/role-context';
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

