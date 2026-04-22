'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Calendar, MessageCircle, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useIsMobile } from '@/hooks/use-mobile';
import SignOutConfirmDialog from '@/components/custom/SignOutConfirmDialog';
import NotificationBell from '@/components/custom/NotificationBell';
import NotificationBellBoundary from '@/components/custom/NotificationBellBoundary';

interface AppShellProps {
  children: React.ReactNode;
  role: string;
  basePath: string;
}

export default function AppShell({ children, role, basePath }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a stable shell until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#138b94]/20 border-t-[#138b94] rounded-full animate-spin" />
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'home',     label: 'Home',     icon: Home,          href: `${basePath}/home` },
    { id: 'search',   label: 'Search',   icon: Search,        href: `${basePath}/search` },
    { id: 'bookings', label: 'Bookings', icon: Calendar,      href: `${basePath}/bookings` },
    { id: 'chats',    label: 'Chat',     icon: MessageCircle, href: `${basePath}/chats` },
    { id: 'profile',  label: 'Profile',  icon: User,          href: `${basePath}/profile` },
  ];

  const activeId = NAV_ITEMS.find(n => pathname.startsWith(n.href))?.id ?? 'home';

  const handleConfirmSignOut = React.useCallback(async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: '/app/login' });
    } catch {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
      router.push('/app/login');
    }
  }, [router]);

  /* ──────────────────── DESKTOP LAYOUT ──────────────────── */
  if (!isMobile) {
    return (
      <>
        <div className="flex min-h-screen bg-[#f8fafc] text-[#0e2b5c] font-sans selection:bg-teal-100 selection:text-teal-900">
          {/* ── Sidebar ── */}
          <aside className="fixed top-0 left-0 z-50 h-screen w-[260px] flex flex-col bg-white/60 backdrop-blur-2xl border-r border-white/50 shadow-[4px_0_30px_rgba(0,0,0,0.02)]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-7 pt-8 pb-6">
            <img src="/assets/icon.png" alt="Dentara" className="h-7 w-auto object-contain drop-shadow-sm" />
            <span className="text-lg font-bold tracking-tight text-[#0e2b5c]">DENTARA</span>
          </div>

          {/* Role badge */}
          <div className="mx-5 mb-6">
            <div className="bg-gradient-to-r from-[#138b94]/10 to-transparent px-4 py-2.5 rounded-2xl border border-[#138b94]/10 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
                <span className="text-[10px] font-black tracking-widest uppercase text-[#0e2b5c]">
                  {role}
                </span>
              </div>
              <NotificationBellBoundary>
                <NotificationBell />
              </NotificationBellBoundary>
            </div>
          </div>

          <div className="mx-5 mb-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-[0_14px_32px_-22px_rgba(10,31,68,0.35)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Live Alerts</p>
              <p className="mt-1 text-xs font-medium text-slate-500">New booking requests and offers appear here instantly.</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-1">
            {NAV_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeId === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => router.push(tab.href)}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#138b94]/10 to-transparent text-[#138b94]'
                      : 'text-gray-400 hover:text-[#0e2b5c] hover:bg-gray-50/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#138b94] rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-5 pb-6 pt-4 border-t border-gray-100/60 mt-auto">
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200"
            >
              <LogOut size={18} strokeWidth={2} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
          </aside>

        {/* ── Main Content ── */}
          <main className="ml-[260px] flex-1 min-h-screen relative">
          {/* Ambient gradients */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden ml-[260px]">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/8 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/8 blur-[120px]" />
          </div>

          <div className="relative z-10 px-10 py-10 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.35 }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          </main>
        </div>
        <SignOutConfirmDialog
          open={showSignOutConfirm}
          onStay={() => setShowSignOutConfirm(false)}
          onExit={handleConfirmSignOut}
          isSubmitting={isSigningOut}
        />
      </>
    );
  }

  /* ──────────────────── MOBILE LAYOUT ──────────────────── */
  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-[#0e2b5c] font-sans overflow-x-hidden relative selection:bg-teal-100 selection:text-teal-900">
      {/* Ambient Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 pt-10 pb-4 bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/icon.png" alt="Dentara" className="h-6 w-auto object-contain drop-shadow-sm" />
          <span className="text-lg font-bold tracking-tight text-[#0e2b5c]">DENTARA</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBellBoundary>
            <NotificationBell />
          </NotificationBellBoundary>
          <div className="bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#0e2b5c]">
              {role}
            </span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="relative z-10 px-6 pt-24 pb-32 max-w-xl mx-auto w-full min-h-[100dvh]">
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

      {/* Premium Floating Dock */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav className="pointer-events-auto bg-white/70 backdrop-blur-3xl border border-white/60 shadow-[0_24px_48px_-12px_rgba(14,43,92,0.15)] rounded-full px-2 py-2 flex items-center gap-1 w-full max-w-sm justify-between">
          {NAV_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeId === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                whileTap={{ scale: 0.92 }}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full focus:outline-none"
              >
                {isActive && (
                  <motion.div layoutId="dock-indicator" className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-100/50" transition={{ type: 'spring', stiffness: 300, damping: 24 }} />
                )}
                <motion.div animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }} className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-[#138b94]' : 'text-gray-400'}`}>
                  <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                {isActive && (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-[9px] font-black tracking-widest uppercase text-[#138b94] mt-0.5">
                    {tab.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <SignOutConfirmDialog
        open={showSignOutConfirm}
        onStay={() => setShowSignOutConfirm(false)}
        onExit={handleConfirmSignOut}
        isSubmitting={isSigningOut}
      />
    </div>
  );
}