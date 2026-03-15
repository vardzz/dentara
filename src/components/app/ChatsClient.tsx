'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search as SearchIcon, CircleUserRound, Bell, CheckCheck, Clock } from 'lucide-react';

export default function ChatsClient({ initialChats }: { initialChats: any[] }) {
  const containerAnim: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim: Variants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-6">
      {/* ── Header ── */}
      <motion.div variants={itemAnim} className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0e2b5c] tracking-tight">Messages</h1>
          <p className="text-sm font-medium text-gray-400 mt-1">Chat securely with matches.</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-center text-[#138b94]">
          <SearchIcon size={20} strokeWidth={2.5} />
        </button>
      </motion.div>

      {/* ── Conversation List ── */}
      <motion.div variants={itemAnim} className="space-y-1 p-2 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.05)] min-h-[200px]">
        {initialChats.length === 0 ? (
           <div className="p-6 text-center text-gray-400 text-sm font-medium">No messages yet.</div>
        ) : (
           <AnimatePresence>
             {/* Map your initialChats here when you build the DB model! */}
           </AnimatePresence>
        )}
      </motion.div>

      <motion.div variants={itemAnim} className="px-6 flex items-center gap-2 text-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        <Clock size={12} strokeWidth={3} />
        <span>End-to-End Encrypted</span>
      </motion.div>
    </motion.div>
  );
}