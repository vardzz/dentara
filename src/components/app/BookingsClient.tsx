'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MapPin, FileCheck } from 'lucide-react';

const TABS = ['Upcoming', 'History'];

export default function BookingsClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const containerAnim: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim: Variants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-8">
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-black text-[#0e2b5c] tracking-tight">Schedule</h1>
        <p className="text-sm font-medium text-gray-400 mt-1">Manage your clinical appointments.</p>
      </motion.div>

      {/* ── Timeline ── */}
      <motion.div variants={itemAnim} className="relative pl-4 space-y-8">
        <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-gradient-to-b from-teal-200 via-gray-200 to-transparent rounded-full" />
        
        {initialAppointments.length === 0 ? (
           <p className="text-sm text-gray-400 pl-12 pt-4">No appointments scheduled yet.</p>
        ) : (
           <AnimatePresence mode="popLayout">
             {/* Map your appointments here just like your static code */}
           </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}