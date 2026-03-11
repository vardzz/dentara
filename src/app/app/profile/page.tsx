'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ShieldCheck, UserCircle, Settings, LogOut, Receipt, FileKey, SwitchCamera, ChevronRight, HelpCircle } from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleRoleToggle = () => {
    setRole(role === 'student' ? 'patient' : 'student');
  };

  const handleLogout = () => {
    router.push('/app/login');
  };

  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const MENU_GROUPS = [
    {
      title: 'Account',
      items: [
        { icon: UserCircle, label: 'Personal Information', color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: Receipt, label: 'Clinical History', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { icon: FileKey, label: 'Waivers & Consent', color: 'text-orange-500', bg: 'bg-orange-50' },
      ]
    },
    {
      title: 'System',
      items: [
        { icon: Settings, label: 'Preferences', color: 'text-gray-600', bg: 'bg-gray-100' },
        { icon: HelpCircle, label: 'Support & FAQ', color: 'text-purple-500', bg: 'bg-purple-50' },
      ]
    }
  ];

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-8">
      
      {/* ── Apple Wallet Style Digital Badge ── */}
      <motion.div variants={itemAnim} className="relative w-full aspect-[1.586/1] rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(14,43,92,0.3)] bg-gradient-to-br from-[#0e2b5c] via-[#1a3d75] to-[#138b94] p-6 text-white flex flex-col justify-between group">
        
        {/* Holographic Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-10 pointer-events-none" />
        
        {/* Background Mesh */}
        <div className="absolute top-[-50%] right-[-10%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-white/0 to-transparent pointer-events-none" />

        <div className="relative z-20 flex justify-between items-start">
          <img src="/assets/icon.png" alt="Dentara" className="w-10 h-10 object-contain drop-shadow-md brightness-0 invert opacity-90" />
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-teal-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-50">Verified {role}</span>
          </div>
        </div>

        <div className="relative z-20">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-200/80 mb-1">
            {role === 'student' ? 'Clinician ID' : 'Patient ID'}
          </p>
          <h2 className="text-3xl font-black tracking-tight drop-shadow-sm">
            {role === 'student' ? 'Dr. Santos' : 'Maria Reyes'}
          </h2>
          <p className="text-sm font-medium text-blue-100/90 mt-1">
            {role === 'student' ? 'UP College of Dentistry' : 'Brgy. 143, Quezon City'}
          </p>
        </div>
      </motion.div>

      {/* ── Settings Menu Groups ── */}
      <div className="space-y-6">
        {MENU_GROUPS.map((group, idx) => (
          <motion.div key={group.title} variants={itemAnim} className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 ml-2">
              {group.title}
            </h3>
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
              {group.items.map((item, itemIdx) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center p-4 bg-transparent hover:bg-white/50 active:bg-gray-50/50 transition-colors ${itemIdx !== group.items.length - 1 ? 'border-b border-gray-100/50' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                    <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="ml-4 font-bold text-[#0e2b5c] flex-1 text-left">{item.label}</span>
                  <ChevronRight size={18} className="text-gray-300" strokeWidth={3} />
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Developer / Sandbox Tools */}
        <motion.div variants={itemAnim} className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 ml-2">
            Sandbox (Demo Only)
          </h3>
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
            <button 
              onClick={handleRoleToggle}
              className="w-full flex items-center p-4 bg-transparent hover:bg-teal-50/50 active:bg-teal-50 transition-colors border-b border-gray-100/50"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-50 text-teal-600 shrink-0">
                <SwitchCamera size={20} strokeWidth={2.5} />
              </div>
              <div className="ml-4 flex-1 text-left">
                <span className="block font-bold text-[#0e2b5c]">Toggle Role View</span>
                <span className="block text-xs font-medium text-gray-400 mt-0.5">Currently viewing as: <span className="font-bold text-[#138b94]">{role}</span></span>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-4 bg-transparent hover:bg-red-50/50 active:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 shrink-0">
                <LogOut size={20} strokeWidth={2.5} />
              </div>
              <span className="ml-4 font-bold text-red-500 flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
