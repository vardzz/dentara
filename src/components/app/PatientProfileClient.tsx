'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, HelpCircle, ChevronRight, Camera, Star, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: { fullName: string; role: string; location?: string | null };
}

export default function PatientProfileClient({ user }: Props) {
  const router = useRouter();

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Header */}
      <motion.div variants={ITEM} className="glass-card-solid p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-3xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] font-bold text-2xl">
            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#138b94] text-white flex items-center justify-center shadow-lg">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-foreground">{user.fullName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{user.location || 'Update your location'}</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined Mar 2025</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /> 4.9 rating</span>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Personal Information</h3>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { icon: User, label: "Full Name", value: user.fullName },
            { icon: Mail, label: "Email", value: "sarah.mitchell@email.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 234-5678" },
            { icon: MapPin, label: "Location", value: user.location || "Dubai, UAE" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-[#138b94]/8 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-[#138b94]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settings</h3>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { icon: Bell, label: "Notifications", desc: "Manage alerts & reminders" },
            { icon: Shield, label: "Privacy & Security", desc: "Password, 2FA, data" },
            { icon: CreditCard, label: "Payment Methods", desc: "Cards & billing history" },
            { icon: HelpCircle, label: "Help & Support", desc: "FAQs, contact us" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/30 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-gray-100/50 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={ITEM}>
        <button
          onClick={() => router.push('/app/login')}
          className="w-full glass-card-solid p-4 flex items-center gap-3 hover:bg-red-50/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-sm font-semibold text-red-500">Sign Out</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
