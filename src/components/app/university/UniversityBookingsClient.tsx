'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const bookings = [
  { student: "Dr. Ahmed Khalil", patient: "Sarah Mitchell", procedure: "Crown Fitting", date: "Mar 26", status: "upcoming" as const },
  { student: "Dr. Reem Nasser", patient: "James Peterson", procedure: "Extraction", date: "Mar 27", status: "upcoming" as const },
  { student: "Dr. Omar Farid", patient: "Maria Garcia", procedure: "Root Canal", date: "Mar 20", status: "completed" as const },
  { student: "Dr. Lina Mansour", patient: "Robert Kim", procedure: "Cleaning", date: "Mar 14", status: "completed" as const },
];

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-[#138b94]/10 text-[#138b94]" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100/60 text-red-600" },
};

export default function UniversityBookingsClient() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Appointment Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Monitor all student appointments</p>
      </motion.div>

      <motion.div variants={ITEM} className="grid grid-cols-3 gap-3">
        {[
          { label: "Upcoming", value: "24", icon: Clock },
          { label: "Completed", value: "186", icon: CheckCircle2 },
          { label: "Cancelled", value: "3", icon: XCircle },
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] text-xs font-bold">
                      {b.student.split(" ").pop()?.[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{b.student}</h4>
                      <p className="text-xs text-muted-foreground">{b.patient} · {b.procedure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{b.date}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  );
}
