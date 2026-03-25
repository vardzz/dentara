'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const mockPatients = [
  { name: "Sarah Mitchell", concern: "Crown Fitting", urgency: "Low", age: 34, status: "Pending" },
  { name: "James Peterson", concern: "Root Canal", urgency: "High", age: 45, status: "New" },
  { name: "Maria Garcia", concern: "Cleaning", urgency: "Low", age: 28, status: "Accepted" },
  { name: "Robert Kim", concern: "Extraction", urgency: "Medium", age: 52, status: "Pending" },
];

export default function StudentSearchClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Find Patients</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse available patient cases for your quotas</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by procedure, urgency..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#138b94]/30 transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={ITEM} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {["All", "New", "Pending", "Accepted"].map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeFilter === s
                ? "bg-[#138b94] text-white shadow-lg"
                : "bg-white/80 border border-gray-100/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </motion.div>

      <motion.div variants={ITEM} className="space-y-3">
        {mockPatients.map((p, i) => (
          <div key={i} className="glass-card-solid p-4 hover-lift cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0e2b5c]/10 flex items-center justify-center text-[#138b94] font-bold text-xs shrink-0">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.concern} · Age {p.age}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.urgency === "High" ? "bg-red-100/60 text-red-600" :
                  p.urgency === "Medium" ? "bg-amber-500/10 text-amber-600" :
                  "bg-[#138b94]/10 text-[#138b94]"
                }`}>
                  {p.urgency} Priority
                </span>
                <span className="text-[10px] text-muted-foreground">{p.status}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
