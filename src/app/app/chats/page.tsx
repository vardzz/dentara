'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search as SearchIcon, CircleUserRound, Bell, CheckCheck, Clock } from 'lucide-react';

const CHATS = [
  { id: 1, name: 'Dr. Santos (Endo)', msg: 'Are you available tomorrow for the prep?', time: '10:42 AM', unread: 2, type: 'faculty' },
  { id: 2, name: 'Maria C.', msg: 'Yes doc, malapit na po ako sa clinic.', time: '09:15 AM', unread: 0, type: 'patient' },
  { id: 3, name: 'System Match', msg: 'New Patient Lead: Class II Amalgam', time: 'Yesterday', unread: 1, type: 'system' },
];

export default function ChatsPage() {
  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

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
      <motion.div variants={itemAnim} className="space-y-1 p-2 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.05)]">
        <AnimatePresence>
          {CHATS.map((chat, i) => {
            const isSystem = chat.type === 'system';
            return (
              <motion.button 
                key={chat.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                className="w-full flex items-center gap-4 p-4 rounded-[24px] hover:bg-white/80 transition-colors focus:bg-white/90 active:scale-[0.98] outline-none text-left"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 ${isSystem ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white shadow-md text-white' : 'bg-gray-100 border-white text-gray-400'}`}>
                    {isSystem ? <Bell size={24} strokeWidth={2.5} /> : <CircleUserRound size={32} strokeWidth={1.5} />}
                  </div>
                  {/* Online Indicator */}
                  {!isSystem && <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />}
                </div>

                {/* Msg Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className={`text-base font-bold truncate pr-3 ${chat.unread > 0 ? 'text-[#0e2b5c]' : 'text-gray-700'}`}>
                      {chat.name}
                    </p>
                    <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${chat.unread > 0 ? 'text-[#138b94]' : 'text-gray-400'}`}>
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {chat.unread === 0 && !isSystem && <CheckCheck size={14} className="text-[#3b82f6] shrink-0" />}
                    {chat.unread > 0 && isSystem && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                    <p className={`text-sm truncate w-full ${chat.unread > 0 ? 'font-bold text-gray-800' : 'font-medium text-gray-500'}`}>
                      {chat.msg}
                    </p>
                  </div>
                </div>

                {/* Unread Badge */}
                {chat.unread > 0 && (
                  <div className="flex flex-col items-end justify-center shrink-0 pb-3">
                    <div className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#138b94] flex items-center justify-center text-[10px] font-black text-white shadow-[0_4px_10px_rgba(19,139,148,0.4)]">
                      {chat.unread}
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── Secure Warning ── */}
      <motion.div variants={itemAnim} className="px-6 flex items-center gap-2 text-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        <Clock size={12} strokeWidth={3} />
        <span>End-to-End Encrypted</span>
      </motion.div>

    </motion.div>
  );
}
