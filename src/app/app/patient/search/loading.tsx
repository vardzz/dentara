import React from 'react';

export default function PatientSearchLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="pt-2">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* Search Input Skeleton */}
      <div className="h-[52px] w-full bg-gray-100 rounded-2xl" />

      {/* Tag pills Skeleton */}
      <div className="flex gap-2 overflow-hidden pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-gray-200 shrink-0" />
        ))}
      </div>

      {/* Results Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-solid p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-2 w-48 bg-gray-200 rounded" />
                <div className="flex gap-3 mt-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
