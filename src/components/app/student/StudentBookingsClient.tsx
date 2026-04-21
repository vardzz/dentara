'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const bookings = [
  { patient: "Sarah Mitchell", procedure: "Crown Fitting", date: "Mar 26, 2026", time: "10:30 AM", location: "Clinic B, Room 204", status: "upcoming" as const, quota: "Tooth Replacement" },
  { patient: "James Peterson", procedure: "Extraction", date: "Mar 27, 2026", time: "9:00 AM", location: "Clinic D, Room 101", status: "upcoming" as const, quota: "Tooth Removal" },
  { patient: "Maria Garcia", procedure: "Cleaning", date: "Mar 20, 2026", time: "2:00 PM", location: "Clinic A, Room 105", status: "completed" as const, quota: "Gum Care" },
  { patient: "Robert Kim", procedure: "Root Canal", date: "Mar 14, 2026", time: "10:00 AM", location: "Clinic C, Room 301", status: "completed" as const, quota: "Root Canal" },
];

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-[#138b94]/10 text-[#138b94]" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100/60 text-red-600" },
};

export default function StudentBookingsClient() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Bookings</h2>
        <p className="text-muted-foreground text-sm mt-1">Your clinical schedule</p>
      </motion.div>

      <motion.div variants={ITEM} className="grid grid-cols-3 gap-3">
        {[
          { label: "Upcoming", value: "2", icon: Clock },
          { label: "Completed", value: "12", icon: CheckCircle2 },
          { label: "Cancelled", value: "1", icon: XCircle },
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
        {bookings
          .filter(b => tab === "upcoming" ? b.status === "upcoming" : b.status !== "upcoming")
          .map((b, i) => {
            const sc = statusConfig[b.status];
            return (
              <div key={i} className="glass-card-solid p-4 hover-lift cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{b.patient}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.procedure}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                    <span className="text-[10px] bg-[#0e2b5c]/10 text-[#0e2b5c] px-2 py-0.5 rounded-full font-medium">{b.quota}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.time}</span>
                </div>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  );
}
