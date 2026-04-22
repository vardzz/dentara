'use client';

import React from 'react';
import { Bell } from 'lucide-react';

type NotificationBellBoundaryProps = {
  children: React.ReactNode;
};

type NotificationBellBoundaryState = {
  hasError: boolean;
};

export default class NotificationBellBoundary extends React.Component<
  NotificationBellBoundaryProps,
  NotificationBellBoundaryState
> {
  state: NotificationBellBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): NotificationBellBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep the shell usable and log details for debugging.
    console.error('Notification bell render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <button
          type="button"
          className="relative inline-flex size-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/85 text-slate-400"
          aria-label="Notifications unavailable"
          title="Notifications are temporarily unavailable"
          disabled
        >
          <Bell className="size-4" />
        </button>
      );
    }

    return this.props.children;
  }
}
