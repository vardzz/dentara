'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Bell, Calendar, MessageCircle, ChevronRight } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const quotas = [
  { name: "Prosthodontics", done: 3, total: 5 },
  { name: "Extraction", done: 1, total: 10 },
  { name: "Endodontics", done: 7, total: 8 },
  { name: "Restorative", done: 4, total: 12 },
  { name: "Periodontics", done: 2, total: 6 },
];

const todaySchedule = [
  { time: "9:00 AM", patient: "Sarah M.", procedure: "Crown Fitting", room: "B-204" },
  { time: "11:30 AM", patient: "Omar K.", procedure: "Extraction", room: "A-101" },
  { time: "2:00 PM", patient: "Fatima R.", procedure: "Cleaning", room: "C-305" },
];

interface Props {
  user: { fullName: string; role: string; school?: string | null };
}

export default function StudentHomeClient({ user }: Props) {
  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Clinician {user.fullName}</h2>
      </motion.div>

      {/* Alerts */}
      <motion.div variants={ITEM} className="flex gap-3">
        <div className="glass-card-solid flex-1 p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#138b94]/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-[#138b94]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">3 Requests</p>
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
              <p className="text-sm font-semibold text-foreground">5 Unread</p>
              <p className="text-[10px] text-muted-foreground">Chat messages</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clinical Quota Progress */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Quota Progress</h3>
        <div className="glass-card-solid p-5 space-y-4">
          {quotas.map((q, i) => {
            const pct = Math.round((q.done / q.total) * 100);
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{q.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{q.done}/{q.total}</span>
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
          })}
        </div>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div variants={ITEM}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today&apos;s Schedule</h3>
          <button className="text-xs text-[#138b94] font-medium flex items-center gap-0.5">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {todaySchedule.map((s, i) => (
            <div key={i} className="glass-card-solid p-4 min-w-[180px] shrink-0 hover-lift cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-3.5 w-3.5 text-[#138b94]" />
                <span className="text-xs font-semibold text-[#138b94]">{s.time}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{s.patient}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.procedure}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Room {s.room}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
