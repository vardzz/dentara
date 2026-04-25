import React from 'react';

export default function UniversitySearchLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Directory Header Skeleton */}
      <div className="pt-2">
        <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-[52px] w-full bg-gray-100 rounded-2xl" />

      {/* List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-solid p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="flex gap-4 mt-3">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
