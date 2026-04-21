'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignOutConfirmDialogProps {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
  isSubmitting?: boolean;
}

export default function SignOutConfirmDialog({
  open,
  onStay,
  onExit,
  isSubmitting = false,
}: SignOutConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),rgba(8,26,58,0.45)] backdrop-blur-md"
            onClick={isSubmitting ? undefined : onStay}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(244,249,255,0.94)_100%)] p-6 shadow-[0_30px_80px_-26px_rgba(8,26,58,0.55)] sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-confirm-title"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[#138b94]/10 blur-2xl" />
              <div className="absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-[#0e2b5c]/8 blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 id="signout-confirm-title" className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-[#0e2b5c] sm:text-[30px]">
                Are you sure you want to leave?
              </h3>
              <p className="mt-2 text-sm font-medium text-[#5f708a]">
                You can always return to your Dentara dashboard anytime.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onStay}
                disabled={isSubmitting}
                className="w-full flex-1 rounded-2xl border border-[#d7dfed] bg-white/90 px-5 py-3 text-sm font-bold text-[#0e2b5c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:border-[#b9c8df] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                No, I want to stay
              </button>
              <button
                type="button"
                onClick={onExit}
                disabled={isSubmitting}
                className="w-full flex-1 rounded-2xl border border-[#ff6d72] bg-[linear-gradient(180deg,#ff6369_0%,#f53c45_100%)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(245,60,69,0.9)] transition-all duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
              >
                Yes, i want to exit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
