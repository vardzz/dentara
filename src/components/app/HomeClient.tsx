'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MapPin, ShieldCheck, ChevronRight, Search, Activity, Plus, UserPlus, FileSignature, CheckCircle2 } from 'lucide-react';

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

interface HomeClientProps {
  user: {
    fullName: string;
    role: string;
    school?: string | null;
    location?: string | null;
  };
  // Add other data props as needed for specific roles
}

export default function HomeClient({ user }: HomeClientProps) {
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (user.role === 'patient') {
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
          className="relative overflow-hidden bg-gradient-to-br from-[#138b94] to-[#0e2b5c] p-6 rounded-[32px] shadow-[0_20px_40px_-12px_rgba(19,139,148,0.4)]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <p className="text-sm font-medium text-teal-100 mb-1">{getGreeting()},</p>
          <h1 className="text-3xl font-black text-white tracking-tight">{user.fullName}</h1>
          
          <div className="mt-6 p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-[20px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-black text-white tracking-wide">VERIFIED PATIENT</p>
                <p className="text-[10px] text-teal-100 mt-0.5 max-w-[140px] leading-tight">Eligible for matched free dental care.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Status Banner ── */}
        <motion.div variants={ITEM_ANIM} className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-5 rounded-[24px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-[#3b82f6] tracking-widest mb-1">Active Search</p>
            <p className="text-sm font-medium text-gray-600 leading-tight">Waiting for a student match for "Wisdom Tooth Pain".</p>
          </div>
        </motion.div>

        {/* ── Nearby Care Widget ── */}
        <motion.div variants={ITEM_ANIM} className="mt-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Nearby Clinics</h2>
            <button className="text-xs font-bold text-[#138b94]">Map View</button>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 1, clinic: 'UP College of Dentistry', dist: '1.2 km', desc: 'Pedro Gil St, Manila' },
              { id: 2, clinic: 'CEU Dental Clinic', dist: '2.4 km', desc: 'Mendiola, Manila' },
              { id: 3, clinic: 'UE College of Dentistry', dist: '3.1 km', desc: 'Recto Ave, Manila' },
            ].map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-sm">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0 text-gray-400">
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-bold text-[#0e2b5c] truncate">{item.clinic}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black tracking-widest uppercase text-[#138b94]">{item.dist}</span>
                    <span className="text-xs font-medium text-gray-400 truncate">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" strokeWidth={3} />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
        
        <p className="text-sm font-medium text-gray-500 mb-1">{getGreeting()},</p>
        <h1 className="text-3xl font-black text-[#0e2b5c] tracking-tight">{user.fullName}</h1>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#138b94] mb-1">
              Licensure Progress
            </p>
            <p className="text-xs font-medium text-gray-600">32 of 50 Clinical Cases</p>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
              <circle 
                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" 
                strokeDasharray="150" strokeDashoffset={150 - (150 * 32) / 50}
                className="text-[#138b94] transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#0e2b5c]">64%</span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={ITEM_ANIM} className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-5 rounded-[24px] active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100/50 flex items-center justify-center text-[#138b94]">
            <Plus strokeWidth={2.5} size={20} />
          </div>
          <span className="text-xs font-bold text-[#0e2b5c]">Log Case</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-5 rounded-[24px] active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
            <UserPlus strokeWidth={2.5} size={20} />
          </div>
          <span className="text-xs font-bold text-[#0e2b5c]">Invite Patient</span>
        </button>
      </motion.div>

      {/* ── Recent Action Log ── */}
      <motion.div variants={ITEM_ANIM} className="mt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Recent Activity</h2>
          <button className="text-xs font-bold text-[#3b82f6]">View All</button>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, title: 'Waiver Signed', desc: 'Maria C. (Class II Comp)', icon: FileSignature, color: 'text-orange-500', bg: 'bg-orange-50' },
            { id: 2, title: 'Case Approved', desc: 'Extraction (Lower Right 8)', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
            { id: 3, title: 'AI Match Found', desc: 'New Complete Denture Lead', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((item) => (
            <div key={item.id} className="flex items-center p-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                <item.icon size={18} strokeWidth={2.5} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-bold text-[#0e2b5c]">{item.title}</p>
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
