'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { RoleProvider, useRole } from '@/lib/role-context';

// ---------------------------------------------------------------------------
// Nav configuration
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: Home,          href: '/app/home' },
  { id: 'search',   label: 'Search',   icon: Search,        href: '/app/search' },
  { id: 'bookings', label: 'Bookings', icon: Calendar,      href: '/app/bookings' },
  { id: 'chats',    label: 'Chat',     icon: MessageCircle, href: '/app/chats' },
  { id: 'profile',  label: 'Space',    icon: User,          href: '/app/profile' },
] as const;

// ---------------------------------------------------------------------------
// Inner App Shell
// ---------------------------------------------------------------------------
function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();

  // Bypass header/nav for Auth routes
  const isAuthPage = pathname === '/app/login' || pathname === '/app/register';
  // Derive active tab
  const activeId = NAV_ITEMS.find(n => pathname.startsWith(n.href))?.id ?? 'home';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-[#0e2b5c] font-sans overflow-x-hidden relative selection:bg-teal-100 selection:text-teal-900">
      
      {/* ── Ambient Mesh Gradients (Ultra-Luxe Depth) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* ── Glass Header ── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 pt-12 pb-4 bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/icon.png"
            alt="Dentara"
            className="h-6 w-auto object-contain drop-shadow-sm"
          />
          <span className="text-lg font-bold tracking-tight text-[#0e2b5c]">
            DENTARA
          </span>
        </div>
        <div className="bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
          <span className="text-[10px] font-black tracking-widest uppercase text-[#0e2b5c]">
            {role}
          </span>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="relative z-10 px-6 pt-32 pb-40 max-w-xl mx-auto w-full min-h-[100dvh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.4 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Premium Floating Dock ── */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav className="pointer-events-auto bg-white/70 backdrop-blur-3xl border border-white/60 shadow-[0_24px_48px_-12px_rgba(14,43,92,0.15)] rounded-full px-2 py-2 flex items-center gap-1 w-full max-w-sm justify-between">
          {NAV_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeId === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                aria-label={tab.label}
                whileTap={{ scale: 0.92 }}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full focus:outline-none"
              >
                {/* Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="dock-indicator"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-100/50"
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  />
                )}
                
                <motion.div
                  animate={{ 
                    y: isActive ? -2 : 0,
                    scale: isActive ? 1.05 : 1 
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-[#138b94]' : 'text-gray-400'
                  }`}
                >
                  <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-[9px] font-black tracking-widest uppercase text-[#138b94] mt-0.5"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App Layout
// ---------------------------------------------------------------------------
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <AppShell>{children}</AppShell>
    </RoleProvider>
  );
}
