'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Plus, UserPlus, FileSignature, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const DASHBOARD_ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 }
  }
};

const ITEM_ANIM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface StudentDashboardProps {
  userName?: string;
}

export default function StudentDashboard({ userName = 'Doctor' }: StudentDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = mounted ? getGreeting() : 'Welcome';

  return (
    <motion.div 
      variants={DASHBOARD_ANIM} 
      initial="hidden" 
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* ── Greeting Card ── */}
      <motion.div 
        variants={ITEM_ANIM}
        className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-[32px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        
        <p className="text-sm font-medium text-gray-500 mb-1">{greeting},</p>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight">{userName}</h1>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal mb-1">
              Progress
            </p>
            <p className="text-xs font-medium text-gray-600">32 of 50 Cases</p>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
              <circle 
                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" 
                strokeDasharray="150" strokeDashoffset={150 - (150 * 32) / 50}
                className="text-brand-teal transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black text-brand-navy">64%</span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={ITEM_ANIM} className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-5 rounded-[24px] active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100/50 flex items-center justify-center text-brand-teal">
            <Plus strokeWidth={2.5} size={20} />
          </div>
          <span className="text-xs font-bold text-brand-navy">Add Case</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-5 rounded-[24px] active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
            <UserPlus strokeWidth={2.5} size={20} />
          </div>
          <span className="text-xs font-bold text-brand-navy">Add Patient</span>
        </button>
      </motion.div>

      {/* ── Past Activities ── */}
      <motion.div variants={ITEM_ANIM} className="mt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Past Activities</h2>
          <button className="text-xs font-bold text-brand-blue">View All</button>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, title: 'Consent Signed', desc: 'Maria C. (Tooth Filling)', icon: FileSignature, color: 'text-orange-500', bg: 'bg-orange-50' },
            { id: 2, title: 'Case Approved', desc: 'Tooth Removal (Lower Right 8)', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
            { id: 3, title: 'Match Found', desc: 'New Tooth Replacement Lead', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((item) => (
            <div key={item.id} className="flex items-center p-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                <item.icon size={18} strokeWidth={2.5} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-bold text-brand-navy">{item.title}</p>
                <p className="text-xs font-medium text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" strokeWidth={3} />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}