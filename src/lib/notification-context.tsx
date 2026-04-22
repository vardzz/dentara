'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  getNotificationStateAction,
  markAsReadAction,
  type NotificationPayload,
  type PendingBookingPayload,
} from '@/app/actions/notifications';
import {
  acceptBookingNotificationAction,
  completeOfferBookingAction,
  rejectBookingNotificationAction,
} from '@/app/actions/booking';

type NotificationContextValue = {
  unreadCount: number;
  notifications: NotificationPayload[];
  pendingBookings: PendingBookingPayload[];
  isLoading: boolean;
  refresh: () => Promise<number | null>;
  markAsRead: (notificationId: string) => Promise<void>;
  acceptOffer: (notificationId: string) => Promise<void>;
  rejectOffer: (notificationId: string) => Promise<void>;
  completeOffer: (notificationId: string, scheduledAtIso: string, notes?: string) => Promise<void>;
};

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<NotificationPayload[]>([]);
  const [pendingBookings, setPendingBookings] = React.useState<PendingBookingPayload[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const FAST_POLL_MS = 1500;
  const SLOW_POLL_MS = 6000;

  const refresh = React.useCallback(async (): Promise<number | null> => {
    try {
      const state = await getNotificationStateAction();
      setUnreadCount(state.unreadCount);
      setNotifications(state.notifications);
      setPendingBookings(state.pendingBookings);
      return state.unreadCount;
    } catch {
      // Keep existing state if the user is not authenticated or request fails transiently.
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    let pollTimeoutId: number | null = null;
    let retryCount = 0;
    const maxRetries = 6;

    const scheduleNextPoll = () => {
      if (cancelled) return;

      const delay = document.visibilityState === 'visible' ? FAST_POLL_MS : SLOW_POLL_MS;
      pollTimeoutId = window.setTimeout(async () => {
        await refresh();
        scheduleNextPoll();
      }, delay);
    };

    const initialRefreshWithRetry = async () => {
      const unread = await refresh();
      if (cancelled) return;

      retryCount += 1;

      // Login redirect can race session propagation; retry briefly to pick up unread count quickly.
      if (retryCount < maxRetries && (unread === null || unread === 0)) {
        window.setTimeout(() => {
          void initialRefreshWithRetry();
        }, 1200);
      }
    };

    void initialRefreshWithRetry();

    scheduleNextPoll();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };

    const handleOnline = () => {
      void refresh();
    };

    window.addEventListener('focus', handleVisibility);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      if (pollTimeoutId) {
        window.clearTimeout(pollTimeoutId);
      }
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refresh]);

  const markAsRead = React.useCallback(async (notificationId: string) => {
    await markAsReadAction(notificationId);
    await refresh();
    router.refresh();
  }, [refresh, router]);

  const acceptOffer = React.useCallback(async (notificationId: string) => {
    await acceptBookingNotificationAction(notificationId);
    await refresh();
    router.refresh();
  }, [refresh, router]);

  const rejectOffer = React.useCallback(async (notificationId: string) => {
    await rejectBookingNotificationAction(notificationId);
    await refresh();
    router.refresh();
  }, [refresh, router]);

  const completeOffer = React.useCallback(async (notificationId: string, scheduledAtIso: string, notes?: string) => {
    await completeOfferBookingAction(notificationId, scheduledAtIso, notes);
    await refresh();
    router.refresh();
  }, [refresh, router]);

  const value = React.useMemo(
    () => ({
      unreadCount,
      notifications,
      pendingBookings,
      isLoading,
      refresh,
      markAsRead,
      acceptOffer,
      rejectOffer,
      completeOffer,
    }),
    [unreadCount, notifications, pendingBookings, isLoading, refresh, markAsRead, acceptOffer, rejectOffer, completeOffer],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationCenter() {
  const ctx = React.useContext(NotificationContext);

  if (!ctx) {
    throw new Error('useNotificationCenter must be used within NotificationProvider');
  }

  return ctx;
}
