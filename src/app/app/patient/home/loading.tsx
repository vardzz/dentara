import React from 'react';

export default function PatientHomeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="pt-2">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-8 w-48 bg-gray-200 rounded" />
      </div>

      {/* Concern Card Skeleton */}
      <div className="bg-gray-100/50 p-5 rounded-[24px] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-2 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>

      {/* Find Student Card Skeleton */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-56 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>

      {/* Upcoming Appointment Skeleton */}
      <div>
        <div className="h-3 w-40 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          {[1].map((i) => (
            <div key={i} className="glass-card-solid p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Activities Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card-solid p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
