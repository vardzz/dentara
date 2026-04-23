'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, User, Bell, Shield, CreditCard, HelpCircle, ChevronRight, Camera, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import SignOutConfirmDialog from '@/components/custom/SignOutConfirmDialog';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: { fullName: string; role: string };
}

export default function UniversityProfileClient({ user }: Props) {
  const router = useRouter();
  const [showSignOutConfirm, setShowSignOutConfirm] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleConfirmSignOut = React.useCallback(async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: '/app/login' });
    } catch {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
      router.push('/app/login');
    }
  }, [router]);

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Header */}
      <motion.div variants={ITEM} className="glass-card-solid p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-3xl bg-brand-navy/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-brand-navy" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-lg">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-foreground">{user.fullName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">College of Dentistry</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0"><MapPin className="h-3 w-3" /> Cairo, Egypt</span>
          <span className="flex items-center gap-1 shrink-0"><User className="h-3 w-3" /> 450 students</span>
        </div>
      </motion.div>

      {/* Organization Info */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Organization Details</h3>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { icon: Building2, label: "Institution", value: user.fullName },
            { icon: Mail, label: "Admin Email", value: "admin@cairo-dentistry.edu" },
            { icon: Phone, label: "Contact", value: "+20 2 3456 7890" },
            { icon: CreditCard, label: "Plan", value: "Enterprise · $4,500/mo" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-brand-teal" />
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

      {/* Admin Settings */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Administration</h3>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { icon: Bell, label: "Notifications", desc: "Alerts & reporting" },
            { icon: Shield, label: "Security", desc: "Access control & permissions" },
            { icon: CreditCard, label: "Billing", desc: "Invoices & subscription" },
            { icon: HelpCircle, label: "Support", desc: "Contact Dentara team" },
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
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full glass-card-solid p-4 flex items-center gap-3 hover:bg-red-50/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-sm font-semibold text-red-500">Sign Out</span>
        </button>
      </motion.div>

      <SignOutConfirmDialog
        open={showSignOutConfirm}
        onStay={() => setShowSignOutConfirm(false)}
        onExit={handleConfirmSignOut}
        isSubmitting={isSigningOut}
      />
    </motion.div>
  );
}
