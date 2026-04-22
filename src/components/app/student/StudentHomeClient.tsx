'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Bell, Calendar, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { getCurrentUserProfile } from '@/app/actions/user';
import { useNotificationCenter } from '@/lib/notification-context';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: { id?: string; fullName: string; role: string; school?: string | null };
}

export default function StudentHomeClient({ user: initialUser }: Props) {
  const { user: authUser } = useRole();
  const { unreadCount } = useNotificationCenter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!authUser?.id) return;
      const data = await getCurrentUserProfile(authUser.id);
      setProfile(data);
      setLoading(false);
    }
    loadData();
  }, [authUser?.id]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#138b94]" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Use profile data if available, fallback to initialUser for name
  const displayName = profile?.fullName || initialUser.fullName;
  const unreadMessages = unreadCount || 0;
  const pendingRequests = unreadCount || 0;

  let parsedCases = [];
  try {
    if (profile?.casesJson) {
      parsedCases = JSON.parse(profile.casesJson);
    }
  } catch (e) {
    console.error("Failed to parse casesJson");
  }

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Student {displayName}</h2>
      </motion.div>

      {/* Alerts */}
      <motion.div variants={ITEM} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-card-solid flex-1 p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#138b94]/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-[#138b94]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{pendingRequests} Requests</p>
              <p className="text-[10px] text-muted-foreground">New patient requests</p>
            </div>
          </div>
        </div>
        <div className="glass-card-solid flex-1 p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0e2b5c]/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-[#0e2b5c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{unreadMessages} Unread</p>
              <p className="text-[10px] text-muted-foreground">Notifications</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clinical Quota Progress */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Quota Progress</h3>
        <div className="glass-card-solid p-5 space-y-4">
          {parsedCases.length > 0 ? (
            parsedCases.map((q: any, i: number) => {
              const total = q.total || 1;
              const pct = Math.min(100, Math.round(((q.done || 0) / total) * 100));
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{q.name || 'Unknown Case'}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{q.done || 0}/{q.total || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-[#138b94] to-[#0e2b5c]/60 rounded-full"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No cases tracked yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
