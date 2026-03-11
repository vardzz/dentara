'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MapPin, Clock, Calendar as CalendarIcon, FileCheck } from 'lucide-react';

const TABS = ['Upcoming', 'History'];

const APPOINTMENTS = [
  { id: 1, date: 'Oct 24', time: '09:00 AM', status: 'Confirmed', patient: 'Maria C.', type: 'Class II Composite', loc: 'UP College of Dentistry' },
  { id: 2, date: 'Oct 28', time: '02:30 PM', status: 'Pending Approval', patient: 'Juan d.C.', type: 'Simple Extraction', loc: 'CEU Dental Clinic' },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-8">
      
      {/* ── Header ── */}
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-black text-[#0e2b5c] tracking-tight">Schedule</h1>
        <p className="text-sm font-medium text-gray-400 mt-1">Manage your clinical appointments.</p>
      </motion.div>

      {/* ── Seamless Segmented Control ── */}
      <motion.div variants={itemAnim} className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-full flex relative">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 py-2.5 text-xs font-black uppercase tracking-widest z-10 transition-colors duration-300"
              style={{ color: isActive ? '#0e2b5c' : '#94a3b8' }}
            >
              {isActive && (
                <motion.div
                  layoutId="booking-tab"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              {tab}
            </button>
          );
        })}
      </motion.div>

      {/* ── Timeline ── */}
      <motion.div variants={itemAnim} className="relative pl-4 space-y-8">
        {/* Timeline Line */}
        <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-gradient-to-b from-teal-200 via-gray-200 to-transparent rounded-full" />

        <AnimatePresence mode="popLayout">
          {APPOINTMENTS.map((apt, i) => {
            const isConfirmed = apt.status === 'Confirmed';
            return (
              <motion.div 
                key={apt.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative pl-12"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 w-[22px] h-[22px] -ml-[11px] rounded-full border-4 border-[#f8fafc] z-10 ${isConfirmed ? 'bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.4)]' : 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.4)]'}`} />

                {/* Glass Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-[28px] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)]">
                  
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{apt.date}</h3>
                      <p className="text-xl font-black text-[#0e2b5c] tracking-tight">{apt.time}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isConfirmed ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                      {apt.status}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent mb-4" />

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <FileCheck size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Requirement</p>
                        <p className="text-sm font-bold text-[#0e2b5c]">{apt.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                        <MapPin size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Location</p>
                        <p className="text-sm font-bold text-[#0e2b5c] truncate pr-4">{apt.loc}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}
