'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { BookingStatus } from '@prisma/client';
import { completeBookingAction } from '@/app/actions/booking';
import { useRouter } from 'next/navigation';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

type StudentBookingItem = {
  id: string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string | null;
  patientName: string;
  clinicAddress: string | null;
};

type StudentBookingsClientProps = {
  bookings: StudentBookingItem[];
};

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:border-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200/60 dark:bg-red-500/10 dark:border-red-500/20' },
  COMPLETED: { label: 'Completed', color: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:border-blue-500/20' },
};

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

function isUpcoming(status: BookingStatus, scheduledAtIso: string): boolean {
  const s = status as string;
  if (s === 'CANCELLED' || s === 'COMPLETED') return false;
  return new Date(scheduledAtIso).getTime() >= Date.now();
}

export default function StudentBookingsClient({ bookings }: StudentBookingsClientProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, BookingStatus>>({});
  const router = useRouter();

  async function handleComplete(id: string) {
    setOptimisticStatuses(prev => ({ ...prev, [id]: 'COMPLETED' as BookingStatus }));
    try {
      await completeBookingAction(id);
      
      // Delay refresh slightly so the user can enjoy the luxurious transition
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setOptimisticStatuses(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      alert(err instanceof Error ? err.message : 'Failed to complete booking');
    }
  }

  const upcomingCount = bookings.filter((booking) => isUpcoming(booking.status, booking.scheduledAt)).length;
  const confirmedCount = bookings.filter((booking) => (booking.status as string) === 'CONFIRMED').length;
  const completedCount = bookings.filter((booking) => (booking.status as string) === 'COMPLETED').length;
  const cancelledCount = bookings.filter((booking) => (booking.status as string) === 'CANCELLED').length;

  const filteredBookings = bookings.filter((booking) =>
    tab === 'upcoming' ? isUpcoming(booking.status, booking.scheduledAt) : !isUpcoming(booking.status, booking.scheduledAt),
  );

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Bookings</h2>
        <p className="text-muted-foreground text-sm mt-1">Your clinical schedule</p>
      </motion.div>

      <motion.div variants={ITEM} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Upcoming', value: String(upcomingCount), icon: Clock },
          { label: 'Confirmed', value: String(confirmedCount), icon: CheckCircle2 },
          { label: 'Completed', value: String(completedCount), icon: CheckCircle2 },
          { label: 'Cancelled', value: String(cancelledCount), icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="glass-card-solid p-3 sm:p-4 text-center">
            <stat.icon className="h-4 w-4 text-[#138b94] mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={ITEM} className="flex gap-1 bg-gray-100/50 p-1 rounded-2xl">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              tab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : "Past"}
          </button>
        ))}
      </motion.div>

      <motion.div variants={ITEM} className="space-y-3">
        {!filteredBookings.length ? (
          <div className="glass-card-solid p-4">
            <p className="text-sm font-medium text-muted-foreground">
              {tab === 'upcoming' ? 'No upcoming bookings yet.' : 'No past bookings yet.'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking) => {
              const currentStatus = (optimisticStatuses[booking.id] || booking.status) as string;
              const sc = statusConfig[currentStatus] || statusConfig['PENDING'];

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.3 } }}
                  key={booking.id} 
                  className="glass-card-solid p-4 hover-lift cursor-pointer relative group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{booking.patientName}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Patient</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <motion.span 
                        layout
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shadow-sm transition-colors duration-500 ${sc.color}`}
                      >
                        {sc.label}
                      </motion.span>
                      
                      <AnimatePresence>
                        {currentStatus === 'CONFIRMED' && (
                          <motion.button
                            layout
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, scale: 0.8, filter: 'blur(2px)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComplete(booking.id);
                            }}
                            disabled={loadingId === booking.id}
                            className="py-1 px-3 bg-white shadow-[0_2px_10px_rgba(19,139,148,0.1)] dark:bg-black/20 text-[#138b94] hover:bg-[#138b94] hover:text-white text-[10px] font-bold rounded-full transition-all duration-300 border border-[#138b94]/20 flex items-center gap-1.5 disabled:opacity-50 hover:shadow-[0_4px_12px_rgba(19,139,148,0.25)] whitespace-nowrap overflow-hidden"
                          >
                            {loadingId === booking.id ? (
                              <Clock className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            <span>{loadingId === booking.id ? 'Updating...' : 'Complete'}</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateLabel(booking.scheduledAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimeLabel(booking.scheduledAt)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.clinicAddress || 'Clinic location not available'}</span>
                  </div>
                  {booking.notes ? <p className="mt-2 text-xs text-muted-foreground">Notes: {booking.notes}</p> : null}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}
