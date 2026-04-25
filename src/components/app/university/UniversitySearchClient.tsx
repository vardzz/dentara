'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Building2, MapPin, Users, GraduationCap } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const mockUniversities = [
  { name: "Cairo University", students: 450, location: "Cairo, Egypt", programs: 6 },
  { name: "King Saud University", students: 320, location: "Riyadh, KSA", programs: 5 },
  { name: "AUB Medical Center", students: 180, location: "Beirut, Lebanon", programs: 4 },
];

export default function UniversitySearchClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredUniversities = mockUniversities.filter((university) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      university.name.toLowerCase().includes(normalizedQuery) ||
      university.location.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Directory</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse partner universities and programs</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search universities..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={ITEM} className="space-y-3">
        {filteredUniversities.length === 0 ? (
          <div className="glass-card-solid p-4 text-sm text-muted-foreground">No matching universities found.</div>
        ) : (
          filteredUniversities.map((u, i) => (
            <div key={i} className="glass-card-solid p-5 hover-lift cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-navy/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-brand-navy" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{u.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {u.location}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {u.students} students</span>
                    <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {u.programs} programs</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
