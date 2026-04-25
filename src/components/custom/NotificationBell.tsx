'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Loader2, MessageSquare, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import BookingTimePicker from '@/components/custom/BookingTimePicker';
import { useNotificationCenter } from '@/lib/notification-context';
import { findOrCreateConversation } from '@/app/actions/chat';

type NotificationBellProps = {
  className?: string;
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function messageFor(type: 'OFFER' | 'BOOKING_REQUEST' | 'ACCEPTED' | 'REJECTED', senderName: string): string {
  if (type === 'OFFER') return `Clinician ${senderName} offered treatment.`;
  if (type === 'BOOKING_REQUEST') return `${senderName} sent a booking request.`;
  if (type === 'ACCEPTED') return `${senderName} accepted your booking.`;
  return `${senderName} rejected the booking request.`;
}

function detailFor(type: 'OFFER' | 'BOOKING_REQUEST' | 'ACCEPTED' | 'REJECTED'): string {
  if (type === 'OFFER') return 'Next step: choose your preferred date and time, then confirm the booking.';
  if (type === 'BOOKING_REQUEST') return 'Review the request and accept or reject it.';
  if (type === 'ACCEPTED') return 'Your booking is confirmed.';
  return 'This booking request was declined.';
}

function formatLocalDateTime(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();
    const basePath = React.useMemo(() => {
      if (pathname.startsWith('/app/student')) return '/app/student';
      if (pathname.startsWith('/app/university')) return '/app/university';
      return '/app/patient';
    }, [pathname]);

  const {
    unreadCount,
    notifications,
    markAsRead,
    acceptOffer,
    rejectOffer,
    completeOffer,
    isLoading,
  } = useNotificationCenter();

  const [open, setOpen] = React.useState(false);
  const [activeNotificationId, setActiveNotificationId] = React.useState<string | null>(null);
  const [offerModalNotificationId, setOfferModalNotificationId] = React.useState<string | null>(null);
  const [isMessageNavigating, setIsMessageNavigating] = React.useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<Date | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [panelPosition, setPanelPosition] = React.useState<{ left: number; top: number; width: number }>({
    left: 16,
    top: 88,
    width: 320,
  });
  const bellButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const activeOffer = notifications.find((item) => item.id === offerModalNotificationId) ?? null;

  const sortedNotifications = React.useMemo(() => {
    return [...notifications].sort((a, b) => {
      const bookingPriorityA = a.type === 'OFFER' || a.type === 'BOOKING_REQUEST' ? 0 : 1;
      const bookingPriorityB = b.type === 'OFFER' || b.type === 'BOOKING_REQUEST' ? 0 : 1;

      if (bookingPriorityA !== bookingPriorityB) {
        return bookingPriorityA - bookingPriorityB;
      }

      const unreadPriorityA = a.status === 'UNREAD' ? 0 : 1;
      const unreadPriorityB = b.status === 'UNREAD' ? 0 : 1;

      if (unreadPriorityA !== unreadPriorityB) {
        return unreadPriorityA - unreadPriorityB;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePanelPosition = React.useCallback(() => {
    const button = bellButtonRef.current;
    if (!button || typeof window === 'undefined') return;

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const maxPanelWidth = viewportWidth >= 768 ? 520 : 420;
    const panelWidth = Math.min(Math.floor(viewportWidth * 0.92), maxPanelWidth);
    const gutter = 16;

    if (viewportWidth >= 768) {
      const desiredLeft = rect.right - panelWidth;
      const left = Math.min(Math.max(desiredLeft, gutter), viewportWidth - panelWidth - gutter);
      const top = Math.max(rect.bottom + 10, gutter);
      setPanelPosition({ left, top, width: panelWidth });
      return;
    }

    const left = Math.max((viewportWidth - panelWidth) / 2, gutter);
    const top = Math.max(rect.bottom + 10, 88);
    setPanelPosition({ left, top, width: panelWidth });
  }, []);

  React.useEffect(() => {
    if (!open) return;

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <button
        ref={bellButtonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex size-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/85 text-brand-navy shadow-[0_12px_28px_-20px_rgba(10,31,68,0.35)] transition-all hover:-translate-y-0.5"
        aria-label="Open notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_0_4px_rgba(255,255,255,0.8)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[130] cursor-default bg-transparent"
                    onClick={() => setOpen(false)}
                    aria-label="Close notification panel"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    style={{
                      left: panelPosition.left,
                      top: panelPosition.top,
                      width: panelPosition.width,
                    }}
                    className="fixed z-[140] overflow-hidden rounded-[26px] border border-white/75 bg-[linear-gradient(170deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] shadow-[0_24px_60px_-26px_rgba(8,26,58,0.55)] backdrop-blur-xl"
                  >
              <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3">
                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-brand-navy">Notifications</h4>
                {isLoading ? <Loader2 className="size-4 animate-spin text-slate-400" /> : null}
              </div>

              <div className="max-h-[min(76vh,520px)] overflow-y-auto pr-1">
                {!notifications.length ? (
                  <p className="px-4 py-5 text-sm font-medium text-slate-500">You are all caught up.</p>
                ) : (
                  sortedNotifications.map((item) => {
                    const isBusy = activeNotificationId === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        className="border-b border-slate-100/80 px-4 py-3 last:border-b-0"
                      >
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={async () => {
                            if (item.status === 'UNREAD') {
                              await markAsRead(item.id);
                            }
                          }}
                        >
                          <p className="text-base font-bold leading-snug text-brand-navy break-words">
                            {messageFor(item.type, item.sender.fullName)}
                          </p>
                          {item.booking ? (
                            <div className="mt-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Booking Details</p>
                              <p className="mt-1 text-xs font-semibold text-slate-700 break-words">
                                Schedule: {new Date(item.booking.scheduledAt).toLocaleString()}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-slate-600 break-words">
                                Clinician: {item.booking.studentName}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-slate-600 break-words">
                                Patient: {item.booking.patientName}
                              </p>
                              {item.booking.notes ? (
                                <p className="mt-0.5 text-xs font-medium text-slate-600 break-words">Notes: {item.booking.notes}</p>
                              ) : null}
                            </div>
                          ) : null}
                          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 break-words">
                            {detailFor(item.type)}
                          </p>
                          {item.booking ? (
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Status: {item.booking.status}</span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">From: {item.sender.fullName}</span>
                            </div>
                          ) : null}
                          <p className="mt-2 text-[11px] text-slate-400">{formatTimestamp(item.createdAt)}</p>
                        </button>

                        {item.type === 'BOOKING_REQUEST' ? (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={async () => {
                                setActiveNotificationId(item.id);
                                try {
                                  await acceptOffer(item.id);
                                } finally {
                                  setActiveNotificationId(null);
                                }
                              }}
                              className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                              aria-label="Accept booking request"
                            >
                              {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-4" />}
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={async () => {
                                setActiveNotificationId(item.id);
                                try {
                                  await rejectOffer(item.id);
                                } finally {
                                  setActiveNotificationId(null);
                                }
                              }}
                              className="inline-flex size-8 items-center justify-center rounded-lg bg-red-500/15 text-red-600 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                              aria-label="Reject booking request"
                            >
                              {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-4" />}
                            </button>
                          </div>
                        ) : null}

                        {item.type === 'OFFER' ? (
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpen(false);
                                setOfferModalNotificationId(item.id);
                                setSelectedSchedule(null);
                              }}
                              className="rounded-xl bg-brand-teal px-3 py-2 text-xs font-bold text-white shadow-[0_14px_30px_-18px_var(--color-brand-teal)]"
                            >
                              Complete Booking
                            </button>
                            <button
                              type="button"
                              disabled={!!isMessageNavigating || isPending}
                              onClick={async () => {
                                try {
                                  setIsMessageNavigating(item.sender.id);
                                  const result = await findOrCreateConversation(item.sender.id);
                                  startTransition(() => {
                                    router.push(`${basePath}/chats/${result.conversationId}`);
                                    setOpen(false);
                                  });
                                } finally {
                                  setIsMessageNavigating(null);
                                }
                              }}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50"
                              aria-label="Message sender"
                            >
                              {(isMessageNavigating === item.sender.id || (isMessageNavigating === item.sender.id && isPending)) ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <MessageSquare className="size-4" />
                              )}
                              Message
                            </button>
                          </div>
                        ) : null}
                      </motion.div>
                    );
                  })
                )}
              </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {activeOffer ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] bg-[radial-gradient(circle_at_top,_rgba(19,139,148,0.15),_transparent_36%),rgba(8,26,58,0.58)] backdrop-blur-[12px]"
                    onClick={() => setOfferModalNotificationId(null)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="fixed left-1/2 top-1/2 z-[160] flex max-h-[92vh] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-5 shadow-[0_30px_80px_-28px_rgba(8,26,58,0.6)]"
                  >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-brand-navy">Complete Booking</h3>
                  <p className="text-sm font-medium text-slate-500">Pick an available date and time from the clinician schedule.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOfferModalNotificationId(null)}
                  className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
                <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/80 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Booking Summary</p>
                  <p className="mt-1 text-xs font-semibold text-slate-700">Clinician: {activeOffer.sender.fullName}</p>
                  {activeOffer.booking ? (
                    <>
                      <p className="mt-1 text-xs font-medium text-slate-600">Current status: {activeOffer.booking.status}</p>
                      <p className="mt-1 text-xs font-medium text-slate-600">
                        Requested schedule: {new Date(activeOffer.booking.scheduledAt).toLocaleString()}
                      </p>
                      {activeOffer.booking.notes ? (
                        <p className="mt-1 text-xs font-medium text-slate-600 break-words">Notes: {activeOffer.booking.notes}</p>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <BookingTimePicker
                  availabilityJson={activeOffer.booking?.studentAvailabilityJson}
                  value={selectedSchedule}
                  onChange={setSelectedSchedule}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200/70 pt-3">
                <button
                  type="button"
                  onClick={() => setOfferModalNotificationId(null)}
                  className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedSchedule}
                  onClick={async () => {
                    if (!selectedSchedule) return;
                    await completeOffer(activeOffer.id, formatLocalDateTime(selectedSchedule));
                    setOfferModalNotificationId(null);
                    setSelectedSchedule(null);
                  }}
                  className="rounded-xl bg-brand-teal px-4 py-2 text-sm font-bold text-white shadow-[0_14px_30px_-18px_var(--color-brand-teal)] disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
