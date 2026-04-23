'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { User, Mail, GraduationCap, MapPin, Bell, Shield, HelpCircle, ChevronRight, Camera, Star, Award, LogOut, Loader2, Edit2, Check, X } from 'lucide-react';
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
  user: { id?: string; fullName: string; role: string; school?: string | null };
}

export default function StudentProfileClient({ user: initialUser }: Props) {
  const router = useRouter();
  const { user: authUser } = useRole();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    school: '',
    yearLevel: '',
    clinicAddress: '',
  });

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!authUser?.id) return;
      const data = await getCurrentUserProfile(authUser.id);
      setProfile(data);
      setFormData({
        fullName: data?.fullName || '',
        school: data?.school || '',
        yearLevel: data?.yearLevel || '',
        clinicAddress: data?.clinicAddress || '',
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
  const yearLevel = profile?.yearLevel || 'Year Level Not Set';
  let totalCases = 0;
  try {
    if (profile?.casesJson) {
      const parsed = JSON.parse(profile.casesJson);
      totalCases = parsed.reduce((acc: number, curr: any) => acc + (curr.done || 0), 0);
    }
  } catch (e) {}

  const patientCount = profile?._count?.studentBookings || 0;

  const handleSave = async () => {
    // Optional: Add an action here to save the profile later
    // await updateUserProfile(authUser.id, formData);
    setIsEditing(false);
    // Optimistically update profile state
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
        <h3 className="text-lg font-bold text-foreground">Dr. {displayName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{yearLevel}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0"><GraduationCap className="h-3 w-3" /> {profile?.school || 'University Not Set'}</span>
          <span className="flex items-center gap-1 shrink-0"><Star className="h-3 w-3 text-amber-400" /> New</span>
        </div>
      </motion.div>

      {/* Clinical Stats */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Cases Done", value: totalCases.toString(), icon: Award },
            { label: "Patients", value: patientCount.toString(), icon: User },
            { label: "Avg Rating", value: "N/A", icon: Star },
          ].map((stat, i) => (
            <div key={i} className="glass-card-solid p-4 text-center">
              <stat.icon className="h-4 w-4 text-brand-teal mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
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
            { id: 'email', icon: Mail, label: "Email", value: profile?.email || 'Not provided', readOnly: true },
            { id: 'school', icon: GraduationCap, label: "University", value: profile?.school || '' },
            { id: 'yearLevel', icon: User, label: "Year Level", value: profile?.yearLevel || '' },
            { id: 'clinicAddress', icon: MapPin, label: "Clinic", value: profile?.clinicAddress || '' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-brand-teal" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                {isEditing && !item.readOnly ? (
                  <input
                    type="text"
                    value={formData[item.id as keyof typeof formData]}
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
