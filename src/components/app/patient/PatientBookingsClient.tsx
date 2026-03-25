'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const bookings = [
  { student: "Dr. Ahmed Khalil", procedure: "Crown Fitting", date: "Mar 26, 2026", time: "10:30 AM", location: "Clinic B, Room 204", status: "upcoming" as const },
  { student: "Dr. Reem Nasser", procedure: "Orthodontic Check", date: "Apr 2, 2026", time: "2:00 PM", location: "Clinic A, Room 105", status: "upcoming" as const },
  { student: "Dr. Omar Farid", procedure: "Root Canal", date: "Mar 15, 2026", time: "9:00 AM", location: "Clinic C, Room 301", status: "completed" as const },
  { student: "Dr. Lina Mansour", procedure: "Deep Cleaning", date: "Mar 10, 2026", time: "11:00 AM", location: "Clinic A, Room 102", status: "completed" as const },
  { student: "Dr. Ahmed Khalil", procedure: "Consultation", date: "Feb 28, 2026", time: "3:30 PM", location: "Clinic B, Room 204", status: "cancelled" as const },
];

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-[#138b94]/10 text-[#138b94]" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100/60 text-red-600" },
};

export default function PatientBookingsClient() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Bookings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your dental appointments</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={ITEM} className="grid grid-cols-3 gap-3">
        {[
          { label: "Upcoming", value: "2", icon: Clock },
          { label: "Completed", value: "5", icon: CheckCircle2 },
          { label: "Cancelled", value: "1", icon: XCircle },
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
        {bookings
          .filter(b => tab === "upcoming" ? b.status === "upcoming" : b.status !== "upcoming")
          .map((b, i) => {
            const sc = statusConfig[b.status];
            return (
              <div key={i} className="glass-card-solid p-4 hover-lift cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{b.student}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.procedure}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.location}</span>
                </div>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  );
}
