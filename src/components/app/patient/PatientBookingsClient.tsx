'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import type { BookingStatus } from '@prisma/client';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

type PatientBookingItem = {
  id: string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string | null;
  studentName: string;
  clinicAddress: string | null;
};

type PatientBookingsClientProps = {
  bookings: PatientBookingItem[];
};

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-700' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-emerald-500/10 text-emerald-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100/70 text-red-600' },
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
  if (status === 'CANCELLED') return false;
  return new Date(scheduledAtIso).getTime() >= Date.now();
}

export default function PatientBookingsClient({ bookings }: PatientBookingsClientProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingCount = bookings.filter((booking) => isUpcoming(booking.status, booking.scheduledAt)).length;
  const confirmedCount = bookings.filter((booking) => booking.status === 'CONFIRMED').length;
  const cancelledCount = bookings.filter((booking) => booking.status === 'CANCELLED').length;

  const filteredBookings = bookings.filter((booking) =>
    tab === 'upcoming' ? isUpcoming(booking.status, booking.scheduledAt) : !isUpcoming(booking.status, booking.scheduledAt),
  );

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Bookings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your dental appointments</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={ITEM} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Upcoming', value: String(upcomingCount), icon: Clock },
          { label: 'Confirmed', value: String(confirmedCount), icon: CheckCircle2 },
          { label: 'Cancelled', value: String(cancelledCount), icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="glass-card-solid p-3 sm:p-4 text-center">
            <stat.icon className="h-4 w-4 text-[#138b94] mx-auto mb-1.5" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Tab Toggle */}
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

      {/* Bookings List */}
      <motion.div variants={ITEM} className="space-y-3">
        {!filteredBookings.length ? (
          <div className="glass-card-solid p-4">
            <p className="text-sm font-medium text-muted-foreground">
              {tab === 'upcoming' ? 'No upcoming bookings yet.' : 'No past bookings yet.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const sc = statusConfig[booking.status];

            return (
              <div key={booking.id} className="glass-card-solid p-4 hover-lift cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{booking.studentName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Doctor / Student Dentist</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateLabel(booking.scheduledAt)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimeLabel(booking.scheduledAt)}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.clinicAddress || 'Clinic location not available'}</span>
                </div>
                {booking.notes ? <p className="mt-2 text-xs text-muted-foreground">Notes: {booking.notes}</p> : null}
              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
