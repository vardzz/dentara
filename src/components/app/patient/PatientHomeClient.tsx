'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Clock, MessageCircle, ChevronRight, MapPin, Sparkles, Shield } from 'lucide-react';

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

export default function PatientHomeClient({ user }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const getGreeting = () => {
    if (!mounted) return 'Welcome';
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">{getGreeting()},</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.fullName}</h2>
      </motion.div>

      {/* Search CTA */}
      <motion.div variants={ITEM} className="glass-card p-6 bg-gradient-to-br from-[#138b94]/10 via-white/80 to-[#0e2b5c]/5 hover-lift cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#138b94]/10 flex items-center justify-center">
            <Search className="h-6 w-6 text-[#138b94]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Find a Dental Student</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Get quality care for your dental concern</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Upcoming Booking */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Appointment</h3>
        <div className="glass-card-solid p-5 bg-gradient-to-br from-[#138b94]/5 to-transparent hover-lift">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">Dr. Ahmed Khalil</p>
                <p className="text-xs text-muted-foreground">4th Year · Prosthodontics</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Tomorrow, 10:30 AM
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Clinic B, Room 204
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase bg-[#138b94]/10 text-[#138b94] px-2.5 py-1 rounded-full">Crown Fitting</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="glass-card-solid divide-y divide-gray-100/50">
          {[
            { title: "Message from Dr. Khalil", sub: "Your x-ray results look great!", time: "2h ago", icon: MessageCircle },
            { title: "Cleaning completed", sub: "Scaling & polishing · Dr. Reem Nasser", time: "3 days ago", icon: Clock },
            { title: "New message", sub: "Appointment reminder for tomorrow", time: "5 days ago", icon: MessageCircle },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 hover:bg-gray-50/30 transition-colors duration-200 cursor-pointer first:rounded-t-3xl last:rounded-b-3xl">
              <div className="w-9 h-9 rounded-xl bg-[#138b94]/8 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-[#138b94]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
