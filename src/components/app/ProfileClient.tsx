'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ShieldCheck, UserCircle, Settings, LogOut, Receipt, FileKey, ChevronRight, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/app/login');
  };

  const containerAnim: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim: Variants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-8">
      {/* ── Apple Wallet Style Digital Badge ── */}
      <motion.div variants={itemAnim} className="relative w-full aspect-[1.586/1] rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(14,43,92,0.3)] bg-gradient-to-br from-[#0e2b5c] via-[#1a3d75] to-[#138b94] p-6 text-white flex flex-col justify-between group">
        <div className="relative z-20 flex justify-between items-start">
          <img src="/assets/icon.png" alt="Dentara" className="w-10 h-10 object-contain drop-shadow-md brightness-0 invert opacity-90" />
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-teal-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-50">Verified {user?.role}</span>
          </div>
        </div>

        <div className="relative z-20">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-200/80 mb-1">
            {user?.role === 'student' ? 'Clinician ID' : 'Patient ID'}
          </p>
          <h2 className="text-3xl font-black tracking-tight drop-shadow-sm">
             {user?.fullName || 'User Name'}
          </h2>
          <p className="text-sm font-medium text-blue-100/90 mt-1">
            {user?.school || user?.location || 'Update profile to add details'}
          </p>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.div variants={itemAnim} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
        <button onClick={handleLogout} className="w-full flex items-center p-4 bg-transparent hover:bg-red-50/50 active:bg-red-50 transition-colors">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 shrink-0">
            <LogOut size={20} strokeWidth={2.5} />
          </div>
          <span className="ml-4 font-bold text-red-500 flex-1 text-left">Sign Out</span>
        </button>
      </motion.div>
    </motion.div>
  );
}