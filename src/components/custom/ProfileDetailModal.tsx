'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarPlus,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquare,
  Sparkles,
  Stethoscope,
  User2,
  ArrowLeft,
} from 'lucide-react';
import BookingTimePicker from '@/components/custom/BookingTimePicker';
import { toPlainCaseLabel } from '@/lib/plain-language';
import { findOrCreateConversation } from '@/app/actions/chat';

export type ProfileRole = 'student' | 'patient';

export type CaseRequirement = {
  name: string;
  count: number;
};

type BaseProfile = {
  id: string;
  fullName: string;
  role: ProfileRole;
  chatId?: string;
};

export type StudentProfile = BaseProfile & {
  role: 'student';
  school: string;
  yearLevel?: string;
  clinicAddress: string;
  cases?: CaseRequirement[];
  availabilityJson?: string | null;
};

export type PatientProfile = BaseProfile & {
  role: 'patient';
  concern: string;
  location: string;
};

export type ProfileModalUser = StudentProfile | PatientProfile;

type ProfileDetailModalProps = {
  open: boolean;
  onClose: () => void;
  selectedUser: ProfileModalUser | null;
  onBookingAction?: (payload: {
    user: ProfileModalUser;
    scheduledAt?: Date;
    notes?: string;
  }) => Promise<void> | void;
};

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() ?? '')
    .join('');
}

function getPrimarySpecialty(cases?: CaseRequirement[]): string {
  if (!cases?.length) {
    return 'General Care';
  }

  return toPlainCaseLabel(cases[0].name);
}

function formatCount(count: number): string {
  return count === 1 ? '1 requirement' : `${count} requirements`;
}

export default function ProfileDetailModal({
  open,
  onClose,
  selectedUser,
  onBookingAction,
}: ProfileDetailModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<'success' | 'error' | 'info'>('success');
  const [selectedSchedule, setSelectedSchedule] = useState<Date | null>(null);

  useEffect(() => {
    if (!open) {
      setIsMessageLoading(false);
      setIsBookingLoading(false);
      setSelectedSchedule(null);
    }
  }, [open]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isMessageLoading && !isBookingLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingLoading, isMessageLoading, onClose, open]);

  if (!open && !toastMessage) {
    return null;
  }

  const isStudent = selectedUser?.role === 'student';
  const roleBadgeLabel = isStudent ? 'Clinician' : 'Patient';
  const RoleBadgeIcon = isStudent ? GraduationCap : User2;
  const primaryActionLabel = isStudent ? 'Request Booking' : 'Offer Treatment';
  const initials = selectedUser ? getInitials(selectedUser.fullName) : 'OK';

  const handleMessage = async () => {
    const activeUser = selectedUser;

    if (!activeUser) {
      return;
    }

    if (isMessageLoading || isBookingLoading) {
      return;
    }

    setIsMessageLoading(true);

    try {
      const result = await findOrCreateConversation(activeUser.id);

      const basePath = pathname.startsWith('/app/student')
        ? '/app/student'
        : pathname.startsWith('/app/university')
          ? '/app/university'
          : '/app/patient';

      router.push(`${basePath}/chats/${result.conversationId}`);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleBooking = async () => {
    const activeUser = selectedUser;

    if (!activeUser) {
      return;
    }

    if (isBookingLoading || isMessageLoading) {
      return;
    }

    if (activeUser.role === 'student' && !selectedSchedule) {
      setToastTone('info');
      setToastMessage('Please choose an available date and time first.');
      return;
    }

    setIsBookingLoading(true);

    try {
      // Supabase mutation / Server Action injection point:
      // - insert or update the booking request / treatment offer record
      // - emit the realtime payload that powers the live dashboard stream
      // - return the canonical booking id so the UI can reconcile optimistic state
      if (onBookingAction) {
        await onBookingAction({
          user: activeUser,
          scheduledAt: selectedSchedule ?? undefined,
        });
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
      }

      setToastTone('success');
      setToastMessage(
        activeUser.role === 'student'
          ? 'Booking request sent to your live dashboard'
          : 'Treatment offer sent to the patient',
      );
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send the request right now. Please try again.';
      setToastTone('error');
      setToastMessage(message);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const toastTitle = toastTone === 'success' ? 'Success' : toastTone === 'error' ? 'Unable to book' : 'Action needed';
  const toastAccentClass =
    toastTone === 'success'
      ? 'bg-[#138b94]/10 text-[#138b94]'
      : toastTone === 'error'
        ? 'bg-red-500/10 text-red-600'
        : 'bg-amber-500/10 text-amber-600';

  return (
    <>
      <AnimatePresence>
        {open && selectedUser ? (
          <>
            <motion.div
              key="profile-detail-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-[radial-gradient(circle_at_top,_rgba(19,139,148,0.14),_transparent_36%),rgba(8,26,58,0.58)] backdrop-blur-[18px]"
              onClick={isMessageLoading || isBookingLoading ? undefined : onClose}
            />

            <motion.div
              key="profile-detail-modal-panel"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-x-0 bottom-0 z-[120] flex items-end justify-center p-0 sm:inset-0 sm:items-center sm:p-4"
            >
              <div className="relative w-full overflow-hidden rounded-t-[32px] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:max-w-3xl sm:rounded-[32px]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#138b94]/10 blur-3xl" />
                  <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-[#0a1f44]/8 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-white/60 blur-3xl" />
                </div>

                <div className="relative z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between px-5 pb-4 pt-4 sm:px-7 sm:pt-7">
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close profile modal"
                      className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/85 text-[#0a1f44] shadow-[0_10px_30px_-20px_rgba(10,31,68,0.3)] transition-all duration-200 hover:-translate-x-0.5 hover:border-[#138b94]/25 hover:bg-white"
                    >
                      <ArrowLeft className="size-4" />
                    </button>

                    <div className="h-11 w-11" aria-hidden="true" />
                  </div>

                  <div className="px-5 pb-4 sm:px-7">
                    <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200/90 sm:hidden" />

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                      <div className="flex items-start gap-4 sm:gap-5">
                        <div className="relative flex size-16 shrink-0 items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(19,139,148,0.14)_0%,rgba(10,31,68,0.08)_100%)] text-xl font-extrabold tracking-[-0.05em] text-[#0a1f44] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:size-20">
                          {initials}
                          <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-white bg-[#138b94] text-white shadow-lg">
                            <RoleBadgeIcon className="size-3.5" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="inline-flex items-center gap-2 rounded-full border border-[#138b94]/15 bg-[#138b94]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#138b94]">
                            <Sparkles className="size-3.5" />
                            {roleBadgeLabel}
                          </div>

                          <h2 className="mt-3 text-[32px] font-black leading-[0.96] tracking-[-0.05em] text-[#0a1f44] sm:text-[42px]">
                            {selectedUser.fullName}
                          </h2>

                        </div>
                      </div>
                      {isStudent && (
                        <div className="flex shrink-0 flex-wrap gap-2 sm:ml-auto sm:justify-end">
                          <div className="rounded-full border border-slate-200/80 bg-white/75 px-3 py-2 text-xs font-semibold text-slate-600 shadow-[0_10px_30px_-16px_rgba(10,31,68,0.25)]">
                            {selectedUser.yearLevel || 'Year not specified'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {isStudent ? (
                        <>
                          <ProfileInfoCard
                            icon={GraduationCap}
                            label="University / School"
                            value={selectedUser.school || 'School not specified'}
                          />
                          <ProfileInfoCard
                            icon={Stethoscope}
                            label="Specialty / Looking For"
                            value={getPrimarySpecialty(selectedUser.cases)}
                            note={selectedUser.cases?.length ? `${formatCount(selectedUser.cases.length)} listed` : 'General availability'}
                          />
                          <div className="sm:col-span-2">
                            <ProfileInfoCard
                              icon={MapPin}
                              label="Clinic Address"
                              value={selectedUser.clinicAddress || 'Clinic address not specified'}
                              note="Precise location for handoff, routing, and booking context"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <ProfileInfoCard
                            icon={CalendarPlus}
                            label="Primary Case / Concern"
                            value={selectedUser.concern || 'General consultation'}
                            note="The anchor for treatment planning and booking prioritization"
                          />
                          <ProfileInfoCard
                            icon={MapPin}
                            label="Location"
                            value={selectedUser.location || 'Location not specified'}
                            note="Distance-aware context for coordination and availability"
                          />
                        </>
                      )}
                    </div>

                    {isStudent && selectedUser.cases?.length ? (
                      <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-white/80 p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-[#0a1f44]">Case Focus</h3>
                            <p className="mt-1 text-xs font-medium text-slate-500">A quick view of the care needs this profile is prioritizing</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {selectedUser.cases.map((item) => (
                            <span
                              key={item.name}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_-18px_rgba(10,31,68,0.25)]"
                            >
                              <span className="size-2 rounded-full bg-[#138b94]" />
                              {toPlainCaseLabel(item.name)}
                              <span className="font-medium text-slate-400">•</span>
                              <span className="font-medium text-slate-500">{item.count}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {isStudent ? (
                      <div className="mt-6">
                        <BookingTimePicker
                          availabilityJson={selectedUser.availabilityJson}
                          value={selectedSchedule}
                          onChange={setSelectedSchedule}
                          title="Select From Available Slots"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="sticky bottom-0 border-t border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(248,250,252,0.98)_100%)] px-5 py-4 backdrop-blur-xl sm:px-7">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleMessage}
                        disabled={isMessageLoading || isBookingLoading}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-5 text-sm font-bold text-[#0a1f44] shadow-[0_12px_30px_-20px_rgba(10,31,68,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#138b94]/25 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isMessageLoading ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
                        Send Message
                      </button>

                      <button
                        type="button"
                        onClick={handleBooking}
                        disabled={isMessageLoading || isBookingLoading}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#138b94] px-5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(19,139,148,0.9)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBookingLoading ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />}
                        {primaryActionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            key={toastMessage}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-4 left-1/2 z-[140] w-[min(92vw,420px)] -translate-x-1/2 rounded-[24px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(240,247,249,0.96)_100%)] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-2xl ${toastAccentClass}`}>
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-[#0a1f44]">{toastTitle}</p>
                <p className="text-sm font-medium text-slate-500">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ProfileInfoCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_40px_-30px_rgba(10,31,68,0.35)] backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#138b94]/10 text-[#138b94]">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-1 text-sm font-bold leading-6 tracking-tight text-[#0a1f44] sm:text-[15px]">{value}</p>
          {note ? <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{note}</p> : null}
        </div>
      </div>
    </div>
  );
}