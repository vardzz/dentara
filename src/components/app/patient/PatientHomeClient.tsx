'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toPlainCaseLabel } from '@/lib/plain-language';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

type BookingItem = {
  id: string;
  status: BookingStatus;
  scheduledAt: string;
  updatedAt: string;
  caseLabel: string | null;
  notes: string | null;
  studentName: string;
  clinicAddress: string | null;
};

interface Props {
  user: { fullName: string; role: string; location?: string | null; concern?: string | null };
  bookings: BookingItem[];
}

function getGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PatientHomeClient({ user, bookings }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const concern = user.concern || 'Not specified';
  const pendingBookings = bookings.filter((booking) => booking.status === 'PENDING');
  const completedBookings = bookings.filter((booking) => booking.status === 'COMPLETED');

  const greeting = mounted ? getGreeting() : 'Welcome';

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">{greeting},</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.fullName}</h2>
      </motion.div>

      <motion.div variants={ITEM} className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-[24px] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-brand-blue tracking-widest mb-1">Current Concern</p>
          <p className="text-sm font-medium text-gray-600 leading-tight">{concern}</p>
        </div>
      </motion.div>

      <Link href="/app/patient/search" prefetch={true} className="block group">
        <motion.div 
          variants={ITEM} 
          className="glass-card p-6 bg-gradient-to-br from-brand-teal/10 via-white/80 to-brand-navy/5 hover-lift cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="h-6 w-6 text-brand-teal" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">Find a Dental Student</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Get quality care for your dental concern</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </motion.div>
      </Link>

      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Appointment</h3>
        <div className="space-y-3">
          {pendingBookings.length === 0 ? (
            <div className="glass-card-solid p-5 hover-lift flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            </div>
          ) : (
            pendingBookings.map((booking) => (
              <div key={booking.id} className="glass-card-solid p-5 border border-brand-blue/15 bg-brand-blue/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-brand-blue/15 flex items-center justify-center text-brand-blue shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">Pending review by {booking.studentName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mounted ? formatDateLabel(booking.scheduledAt) : '...'} · {mounted ? formatTimeLabel(booking.scheduledAt) : '...'}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        {toPlainCaseLabel(booking.caseLabel || concern)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue whitespace-nowrap">
                    Pending
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past Activities</h3>
        <div className="space-y-3">
          {completedBookings.length === 0 ? (
            <div className="glass-card-solid p-5 flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">No past activities.</p>
            </div>
          ) : (
            completedBookings.map((booking) => (
              <div key={booking.id} className="glass-card-solid p-5 border border-emerald-200/60 bg-emerald-50/35">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{booking.studentName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mounted ? formatDateLabel(booking.updatedAt) : '...'} · {mounted ? formatTimeLabel(booking.updatedAt) : '...'}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        {toPlainCaseLabel(booking.caseLabel || concern)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    Completed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
