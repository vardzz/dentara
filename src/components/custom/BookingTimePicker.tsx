'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3 } from 'lucide-react';
import { getUpcomingAvailability } from '@/lib/availability';

type BookingTimePickerProps = {
  availabilityJson?: string | null;
  value: Date | null;
  onChange: (nextValue: Date | null) => void;
  title?: string;
};

function formatDayLabel(dateISO: string, day: string): string {
  const date = new Date(`${dateISO}T00:00:00`);
  return `${day} ${date.getDate()}`;
}

function toDate(dateISO: string, time: string): Date {
  return new Date(`${dateISO}T${time}:00`);
}

export default function BookingTimePicker({
  availabilityJson,
  value,
  onChange,
  title = 'Choose Date & Time',
}: BookingTimePickerProps) {
  const availability = React.useMemo(() => getUpcomingAvailability(availabilityJson, 21), [availabilityJson]);

  const [selectedDateISO, setSelectedDateISO] = React.useState<string | null>(availability[0]?.date ?? null);

  React.useEffect(() => {
    if (value) {
      setSelectedDateISO(value.toISOString().split('T')[0]);
      return;
    }

    if (!selectedDateISO && availability[0]) {
      setSelectedDateISO(availability[0].date);
    }
  }, [availability, selectedDateISO, value]);

  const selectedDate = availability.find((item) => item.date === selectedDateISO) ?? null;
  const selectedTime = value
    ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
    : null;

  return (
    <div className="rounded-[26px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_14px_34px_-28px_rgba(10,31,68,0.45)]">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-[#138b94]" />
        <h4 className="text-sm font-bold tracking-tight text-[#0a1f44]">{title}</h4>
      </div>

      {!availability.length ? (
        <p className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
          This clinician has not published availability yet.
        </p>
      ) : (
        <>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {availability.map((item) => {
              const isActive = item.date === selectedDateISO;

              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => {
                    setSelectedDateISO(item.date);
                    onChange(null);
                  }}
                  className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-[#138b94]/30 bg-[#138b94]/10 text-[#0a1f44]'
                      : 'border-slate-200/80 bg-white text-slate-600 hover:border-[#138b94]/20'
                  }`}
                >
                  {formatDayLabel(item.date, item.day)}
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              <Clock3 className="size-3.5" />
              Available Times
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(selectedDate?.slots ?? []).map((slot) => {
                const isSelected = selectedTime === slot;

                return (
                  <motion.button
                    key={slot}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => {
                      if (!selectedDate) return;
                      onChange(toDate(selectedDate.date, slot));
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#138b94] text-white shadow-[0_14px_30px_-16px_rgba(19,139,148,0.85)]'
                        : 'border border-slate-200/80 bg-white text-slate-600 hover:border-[#138b94]/25'
                    }`}
                  >
                    {slot}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
