'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Bell, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
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

type BaseBooking = {
  id: string;
  caseLabel: string | null;
  notes: string | null;
  patient: {
    fullName: string;
    concern: string | null;
  };
};

interface Props {
  user: {
    fullName: string;
    role: string;
    school?: string | null;
    casesJson?: string | null;
  };
  progress: Record<string, number>;
  unreadChatCount?: number;
  upcomingCases?: (BaseBooking & { scheduledAt: Date | null })[];
  recentActivities?: (BaseBooking & { updatedAt: Date })[];
}

const QUOTA_LABELS = ['Tooth Removal', 'Gum Care', 'Tooth Filling', 'Tooth Replacement'] as const;

function formatDateLabel(iso: string | Date | null): string {
  if (!iso) return 'Date not specified';
  return new Date(iso).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeLabel(iso: string | Date | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StudentHomeClient({ user, progress, unreadChatCount = 0, upcomingCases = [], recentActivities = [] }: Props) {
  const { unreadCount } = useNotificationCenter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayName = user.fullName;
  const unreadMessages = unreadChatCount;
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

      {/* Upcoming Cases */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Upcoming Cases
        </h3>
        <div className="space-y-3">
          {upcomingCases.length === 0 ? (
            <div className="glass-card-solid p-5 flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">No upcoming confirmed cases.</p>
            </div>
          ) : (
            upcomingCases.map((booking) => (
              <div key={booking.id} className="glass-card-solid p-5 border border-[#3b82f6]/15 bg-[#3b82f6]/6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#3b82f6]/15 flex items-center justify-center text-[#3b82f6] shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {booking.patient.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateLabel(booking.scheduledAt)}
                        {booking.scheduledAt && ` · ${formatTimeLabel(booking.scheduledAt)}`}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        {toPlainCaseLabel(booking.caseLabel || booking.patient.concern || 'General Care')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] whitespace-nowrap">
                    Confirmed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <div className="glass-card-solid p-5 flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            </div>
          ) : (
            recentActivities.slice(0, 5).map((booking) => (
              <div key={booking.id} className="glass-card-solid p-5 border border-emerald-200/60 bg-emerald-50/35">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        Completed: {booking.patient.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateLabel(booking.updatedAt)} · {formatTimeLabel(booking.updatedAt)}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        {toPlainCaseLabel(booking.caseLabel || booking.patient.concern || 'General Care')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    Completed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
