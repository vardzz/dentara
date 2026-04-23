'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, HelpCircle, ChevronRight, Camera, Star, Calendar, LogOut, Loader2, Edit2, Check, X, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import SignOutConfirmDialog from '@/components/custom/SignOutConfirmDialog';
import { useRole } from '@/lib/role-context';
import { getCurrentUserProfile } from '@/app/actions/user';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: { id?: string; fullName: string; role: string; location?: string | null };
}

export default function PatientProfileClient({ user: initialUser }: Props) {
  const router = useRouter();
  const { user: authUser } = useRole();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    location: '',
    concern: '',
  });

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!authUser?.id) return;
      const data = await getCurrentUserProfile(authUser.id);
      setProfile(data);
      setFormData({
        fullName: data?.fullName || '',
        age: data?.age?.toString() || '',
        phone: data?.phone || '',
        location: data?.location || '',
        concern: data?.concern || '',
      });
      setLoading(false);
    }
    loadData();
  }, [authUser?.id]);

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

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const displayName = profile?.fullName || initialUser.fullName;
  const location = profile?.location || 'Update your location';
  
  const handleSave = async () => {
    // Optional: Add server action call to save profile
    setIsEditing(false);
    setProfile((prev: any) => ({ ...prev, ...formData }));
  };

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Header */}
      <motion.div variants={ITEM} className="glass-card-solid p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-3xl bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold text-2xl">
            {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> New Patient</span>
          <span className="flex items-center gap-1 shrink-0"><Star className="h-3 w-3 text-amber-400" /> Unrated</span>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={ITEM}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Information</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="text-xs text-brand-teal font-medium flex items-center gap-1">
              <Edit2 className="h-3 w-3" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(false)} className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <X className="h-3 w-3" /> Cancel
              </button>
              <button onClick={handleSave} className="text-xs text-brand-teal font-medium flex items-center gap-1">
                <Check className="h-3 w-3" /> Save
              </button>
            </div>
          )}
        </div>
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[
            { id: 'fullName', icon: User, label: "Full Name", value: profile?.fullName },
            { id: 'age', icon: User, label: "Age", value: profile?.age?.toString() },
            { id: 'email', icon: Mail, label: "Email", value: profile?.email || 'Not provided', readOnly: true },
            { id: 'phone', icon: Phone, label: "Phone", value: profile?.phone || '' },
            { id: 'location', icon: MapPin, label: "Location", value: profile?.location || '' },
            { id: 'concern', icon: Stethoscope, label: "Primary Concern", value: profile?.concern || '' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-brand-teal" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                {isEditing && !item.readOnly ? (
                  <input
                    type={item.id === 'age' ? 'number' : 'text'}
                    value={formData[item.id as keyof typeof formData] || ''}
                    onChange={(e) => setFormData({ ...formData, [item.id]: e.target.value })}
                    className="w-full bg-transparent border-b border-brand-teal/30 focus:border-brand-teal outline-none text-sm font-medium text-foreground pb-1"
                    placeholder={`Enter ${item.label.toLowerCase()}`}
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{item.value || <span className="text-gray-400 italic">Not set</span>}</p>
                )}
              </div>
              {!isEditing && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
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
