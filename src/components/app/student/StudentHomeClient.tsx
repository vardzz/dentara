'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Bell, MessageCircle } from 'lucide-react';
import { useNotificationCenter } from '@/lib/notification-context';
import { toPlainCaseLabel } from '@/lib/plain-language';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface Props {
  user: {
    fullName: string;
    role: string;
    school?: string | null;
    casesJson?: string | null;
  };
  progress: Record<string, number>;
}

const QUOTA_LABELS = ['Tooth Removal', 'Gum Care', 'Tooth Filling', 'Tooth Replacement'] as const;

export default function StudentHomeClient({ user, progress }: Props) {
  const { unreadCount } = useNotificationCenter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayName = user.fullName;
  const unreadMessages = unreadCount || 0;
  const pendingRequests = unreadCount || 0;

  let parsedCases: { name: string; count?: number; required?: number }[] = [];
  try {
    if (user.casesJson) {
      parsedCases = JSON.parse(user.casesJson);
    }
  } catch (e) {
    console.error("Failed to parse casesJson", e);
  }

  const requiredByLabel = QUOTA_LABELS.reduce((acc, label) => {
    acc[label] = 0;
    return acc;
  }, {} as Record<(typeof QUOTA_LABELS)[number], number>);

  for (const entry of parsedCases) {
    const normalizedLabel = toPlainCaseLabel(String(entry.name ?? ''));

    if (QUOTA_LABELS.includes(normalizedLabel as (typeof QUOTA_LABELS)[number])) {
      const quotaTarget = Number(entry.count ?? entry.required ?? 0);
      requiredByLabel[normalizedLabel as (typeof QUOTA_LABELS)[number]] = Math.max(0, quotaTarget);
    }
  }

  const normalizedProgress = QUOTA_LABELS.reduce((acc, label) => {
    acc[label] = 0;
    return acc;
  }, {} as Record<(typeof QUOTA_LABELS)[number], number>);

  for (const [label, count] of Object.entries(progress)) {
    const normalizedLabel = toPlainCaseLabel(label);

    if (QUOTA_LABELS.includes(normalizedLabel as (typeof QUOTA_LABELS)[number])) {
      normalizedProgress[normalizedLabel as (typeof QUOTA_LABELS)[number]] += Number(count) || 0;
    }
  }

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Student {displayName}</h2>
      </motion.div>

      {/* Alerts */}
      <motion.div variants={ITEM} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-card-solid flex-1 p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#138b94]/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-[#138b94]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{pendingRequests} Requests</p>
              <p className="text-[10px] text-muted-foreground">New patient requests</p>
            </div>
          </div>
        </div>
        <div className="glass-card-solid flex-1 p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0e2b5c]/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-[#0e2b5c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{unreadMessages} Unread</p>
              <p className="text-[10px] text-muted-foreground">Notifications</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clinical Quota Progress */}
      <motion.div variants={ITEM}>
        <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">
          Clinical Quota Progress
        </h3>
        <div className="glass-card-solid p-4 space-y-4">
          {QUOTA_LABELS.map((label) => {
            const current = normalizedProgress[label] || 0;
            const required = requiredByLabel[label] || 0;
            const progressPercentage = required > 0 ? Math.min((current / required) * 100, 100) : 0;

            return (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-sm text-foreground">{label}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {current}/{required}
                  </p>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-1.5 dark:bg-gray-700">
                  <div
                    className="bg-gradient-to-r from-[#138b94] to-[#0e2b5c] h-1.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
