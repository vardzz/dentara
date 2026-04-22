'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Star, MapPin } from 'lucide-react';
import { searchStudents } from '@/app/actions/search';
import { createBookingRequestAction } from '@/app/actions/booking';
import ProfileDetailModal, { type ProfileModalUser } from '@/components/custom/ProfileDetailModal';
import { PLAIN_CASE_FILTERS, matchesPlainCaseLabel, toPlainCaseLabel } from '@/lib/plain-language';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

type CaseRequirement = {
  name: string;
  count: number;
};

type StudentSearchItem = {
  id: string;
  fullName: string;
  school: string;
  yearLevel: string;
  clinicAddress: string;
  cases: CaseRequirement[];
  availabilityJson: string | null;
};

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() ?? '')
    .join('');
}

function getPrimarySpecialty(cases: CaseRequirement[]): string {
  if (!cases.length) return 'General Care';
  return toPlainCaseLabel(cases[0].name);
}

function getProfileMeta(id: string): { rating: string; reviews: number } {
  const seed = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.5 + (seed % 5) * 0.1).toFixed(1);
  const reviews = 20 + (seed % 41);
  return { rating, reviews };
}

function formatLocalDateTime(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
}

export default function PatientSearchClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ProfileModalUser | null>(null);

  React.useEffect(() => {
    let isCancelled = false;

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const result = await searchStudents(searchQuery, undefined, undefined);

      if (isCancelled) {
        return;
      }

      if (!result.success) {
        setStudents([]);
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setStudents(result.data);
      setIsLoading(false);
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const visibleStudents =
    activeFilter === 'All'
      ? students
      : students.filter((student) => student.cases.some((item) => matchesPlainCaseLabel(item.name, activeFilter)));

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Find a Clinician</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse dental students by specialty</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or clinic location..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#138b94]/30 transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={ITEM} className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar scrollbar-hide">
        {PLAIN_CASE_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeFilter === s
                ? "bg-[#138b94] text-white shadow-lg"
                : "bg-white/80 border border-gray-100/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </motion.div>

      <motion.div variants={ITEM} className="space-y-3">
        {isLoading && (
          <div className="glass-card-solid p-4 text-sm text-muted-foreground">Loading clinicians...</div>
        )}

        {!isLoading && error && (
          <div className="glass-card-solid p-4 text-sm text-red-600">{error}</div>
        )}

        {!isLoading && !error && visibleStudents.length === 0 && (
          <div className="glass-card-solid p-4 text-sm text-muted-foreground">No matching clinicians found.</div>
        )}

        {!isLoading && !error && visibleStudents.map((student) => {
          const isMock = student.id.startsWith('mock-');
          const specialty = getPrimarySpecialty(student.cases);
          const profileMeta = getProfileMeta(student.id);
          const selectedStudent: ProfileModalUser = {
            id: student.id,
            fullName: student.fullName,
            role: 'student',
            school: student.school,
            yearLevel: student.yearLevel,
            clinicAddress: student.clinicAddress,
            cases: student.cases,
            availabilityJson: student.availabilityJson,
            chatId: `chat-${student.id}`,
          };

          return (
            <div
              key={student.id}
              className="glass-card-solid p-4 hover-lift cursor-pointer"
              onClick={() => setSelectedProfile(selectedStudent)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedProfile(selectedStudent);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] font-bold text-sm shrink-0">
                  {getInitials(student.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-foreground text-sm truncate">{student.fullName}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isMock
                        ? 'bg-[#138b94]/10 text-[#138b94]'
                        : 'bg-emerald-100/70 text-emerald-700'
                    }`}>
                      {isMock ? 'Premium Mock' : 'Verified User'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {student.yearLevel || 'Year not specified'} · {specialty}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{student.school || 'School not specified'}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      {profileMeta.rating} ({profileMeta.reviews})
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{student.clinicAddress || 'Clinic address not specified'}</span>
                    </span>
                  </div>
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
        onBookingAction={async ({ user, scheduledAt }) => {
          if (user.role !== 'student' || !scheduledAt) {
            throw new Error('Booking requires a student and selected schedule.');
          }

          await createBookingRequestAction(user.id, formatLocalDateTime(scheduledAt));
        }}
      />
    </motion.div>
  );
}
