'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { User, Mail, GraduationCap, MapPin, Bell, Shield, HelpCircle, ChevronRight, Camera, Star, Award, LogOut } from 'lucide-react';
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
  user: { fullName: string; role: string; school?: string | null };
}

export default function StudentProfileClient({ user }: Props) {
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
        <h3 className="text-lg font-bold text-foreground">Dr. {user.fullName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">4th Year · Prosthodontics</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0"><GraduationCap className="h-3 w-3" /> {user.school || 'University'}</span>
          <span className="flex items-center gap-1 shrink-0"><Star className="h-3 w-3 text-amber-400" /> 4.9 rating</span>
        </div>
      </motion.div>

      {/* Clinical Stats */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Cases Done", value: "27", icon: Award },
            { label: "Patients", value: "18", icon: User },
            { label: "Avg Rating", value: "4.9", icon: Star },
          ].map((stat, i) => (
            <div key={i} className="glass-card-solid p-4 text-center">
              <stat.icon className="h-4 w-4 text-[#138b94] mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Personal Information</h3>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { icon: User, label: "Full Name", value: user.fullName },
            { icon: Mail, label: "Email", value: "a.khalil@cairo-uni.edu" },
            { icon: GraduationCap, label: "University", value: user.school || "Cairo University" },
            { icon: MapPin, label: "Clinic", value: "Clinic B, Room 204" },
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
            { icon: Bell, label: "Notifications", desc: "Patient alerts & reminders" },
            { icon: Shield, label: "Privacy & Security", desc: "Password & 2FA" },
            { icon: HelpCircle, label: "Help & Support", desc: "FAQs, contact admin" },
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
