import React from 'react';

export default function UniversityBookingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="pt-2">
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-solid p-4">
            <div className="h-4 w-4 bg-gray-200 rounded mx-auto mb-1.5" />
            <div className="h-6 w-12 bg-gray-200 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-1 bg-gray-100/50 p-1 rounded-2xl h-[42px]">
        <div className="flex-1 bg-white rounded-xl shadow-sm" />
        <div className="flex-1 rounded-xl" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-solid p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-12 bg-gray-200 rounded-full" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
