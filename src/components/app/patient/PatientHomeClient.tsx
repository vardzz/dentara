'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Clock, MessageCircle, ChevronRight, MapPin, Sparkles, Shield, Loader2 } from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { getCurrentUserProfile } from '@/app/actions/user';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: { id?: string; fullName: string; role: string; location?: string | null };
}

export default function PatientHomeClient({ user: initialUser }: Props) {
  const { user: authUser } = useRole();
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

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#138b94]" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const displayName = profile?.fullName || initialUser.fullName;
  const concern = profile?.concern || 'Not specified';
  const pendingRequests = profile?._count?.patientBookings || 0;

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">{getGreeting()},</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{displayName}</h2>
      </motion.div>

      {/* Active Concern Banner */}
      <motion.div variants={ITEM} className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-5 rounded-[24px] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0">
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-[#3b82f6] tracking-widest mb-1">Current Concern</p>
          <p className="text-sm font-medium text-gray-600 leading-tight">{concern}</p>
        </div>
      </motion.div>

      {/* Search CTA */}
      <motion.div variants={ITEM} className="glass-card p-6 bg-gradient-to-br from-[#138b94]/10 via-white/80 to-[#0e2b5c]/5 hover-lift cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#138b94]/10 flex items-center justify-center">
            <Search className="h-6 w-6 text-[#138b94]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Find a Dental Student</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Get quality care for your dental concern</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Upcoming Booking */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Appointment</h3>
        <div className="glass-card-solid p-5 hover-lift flex items-center justify-center h-24">
          <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="glass-card-solid p-5 flex items-center justify-center h-24">
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
