'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { searchPatients } from '@/app/actions/search';
import { createOfferAction } from '@/app/actions/booking';
import ProfileDetailModal, { type ProfileModalUser } from '@/components/custom/ProfileDetailModal';
import { toPlainCaseLabel } from '@/lib/plain-language';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

type PatientSearchItem = {
  id: string;
  fullName: string;
  concern: string;
  location: string;
};

const LOCATION_FILTERS = ['All', 'Makati City', 'Taguig City', 'Quezon City', 'Manila'];

function getPriorityFromConcern(concern: string): 'High' | 'Medium' | 'Low' {
  const normalized = concern.toLowerCase();
  if (normalized.includes('impacted') || normalized.includes('pain') || normalized.includes('extraction')) {
    return 'High';
  }
  if (normalized.includes('restoration') || normalized.includes('crown') || normalized.includes('root canal')) {
    return 'Medium';
  }
  return 'Low';
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() ?? '')
    .join('');
}

export default function StudentSearchClient() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<PatientSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ProfileModalUser | null>(null);

  React.useEffect(() => {
    let isCancelled = false;
    const locationFilter = activeFilter === 'All' ? undefined : activeFilter;

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const result = await searchPatients(searchQuery, locationFilter);

      if (isCancelled) {
        return;
      }

      if (!result.success) {
        setPatients([]);
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setPatients(result.data);
      setIsLoading(false);
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, activeFilter]);

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Find Patients</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse available patient cases for your quotas</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name or concern..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={ITEM} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-hide">
        {LOCATION_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeFilter === s
                ? "bg-brand-teal text-white shadow-lg"
                : "bg-white/80 border border-gray-100/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </motion.div>

      <motion.div variants={ITEM} className="space-y-3">
        {isLoading && (
          <div className="glass-card-solid p-4 text-sm text-muted-foreground">Loading patients...</div>
        )}

        {!isLoading && error && (
          <div className="glass-card-solid p-4 text-sm text-red-600">{error}</div>
        )}

        {!isLoading && !error && patients.length === 0 && (
          <div className="glass-card-solid p-4 text-sm text-muted-foreground">
            No matching patients found.
          </div>
        )}

        {!isLoading && !error && patients.map((patient, index) => {
          const priority = getPriorityFromConcern(patient.concern);
          const selectedPatient: ProfileModalUser = {
            id: patient.id,
            fullName: patient.fullName,
            role: 'patient',
            concern: patient.concern,
            location: patient.location,
            chatId: `chat-${patient.id}`,
          };

          return (
            <div
              key={patient.id}
              className="glass-card-solid p-4 hover-lift cursor-pointer relative"
              onClick={() => setSelectedProfile(selectedPatient)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedProfile(selectedPatient);
                }
              }}
            >
              {index === 0 && (
                <div className="absolute -top-2 -left-2 z-10 rounded-full bg-yellow-400/15 p-1.5 shadow-[0_0_18px_rgba(250,204,21,0.85),0_0_30px_rgba(250,204,21,0.42)] ring-1 ring-yellow-300/70">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]" />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-navy/10 flex items-center justify-center text-brand-teal font-bold text-xs shrink-0">
                    {getInitials(patient.fullName)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{patient.fullName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {patient.concern ? toPlainCaseLabel(patient.concern) : 'General Care'}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {patient.location || 'Location not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    priority === 'High' ? 'bg-red-100/60 text-red-600' :
                    priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-brand-teal/10 text-brand-teal'
                  }`}>
                    {priority} Priority
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Verified User
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <ProfileDetailModal
        open={selectedProfile !== null}
        onClose={() => setSelectedProfile(null)}
        selectedUser={selectedProfile}
        onBookingAction={async ({ user }) => {
          if (user.role !== 'patient') {
            throw new Error('Offers can only be sent to patients.');
          }

          await createOfferAction(user.id);
        }}
      />
    </motion.div>
  );
}
