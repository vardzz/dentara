'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const specialties = ["General", "Prosthodontics", "Orthodontics", "Endodontics", "Periodontics", "Oral Surgery"];

const mockStudents = [
  { name: "Dr. Ahmed Khalil", year: "4th Year", specialty: "Prosthodontics", rating: 4.9, reviews: 42, location: "Clinic A", available: true, avatar: "AK" },
  { name: "Dr. Reem Nasser", year: "5th Year", specialty: "Orthodontics", rating: 4.8, reviews: 38, location: "Clinic B", available: true, avatar: "RN" },
  { name: "Dr. Omar Farid", year: "3rd Year", specialty: "Endodontics", rating: 4.7, reviews: 27, location: "Clinic C", available: false, avatar: "OF" },
  { name: "Dr. Lina Mansour", year: "4th Year", specialty: "Periodontics", rating: 4.9, reviews: 55, location: "Clinic A", available: true, avatar: "LM" },
  { name: "Dr. Yusuf El-Amin", year: "5th Year", specialty: "Oral Surgery", rating: 4.6, reviews: 31, location: "Clinic D", available: true, avatar: "YE" },
];

export default function PatientSearchClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Find a Clinician</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse dental students by specialty</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, specialty, or location..."
          className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#138b94]/30 transition-all duration-200"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-[#138b94]/10 text-[#138b94] hover:bg-[#138b94]/20 transition-colors">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </motion.div>

      <motion.div variants={ITEM} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {["All", ...specialties].map((s) => (
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
        {mockStudents.map((s, i) => (
          <div key={i} className="glass-card-solid p-4 hover-lift cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] font-bold text-sm shrink-0">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground text-sm">{s.name}</h4>
                  {s.available ? (
                    <span className="text-[10px] font-semibold bg-[#138b94]/10 text-[#138b94] px-2 py-0.5 rounded-full">Available</span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-full">Busy</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.year} · {s.specialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    {s.rating} ({s.reviews})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
