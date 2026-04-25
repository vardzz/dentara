import React from 'react';

export default function UniversityHomeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="pt-2">
        <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-8 w-48 bg-gray-200 rounded" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-solid p-5">
            <div className="w-10 h-10 rounded-2xl bg-gray-200 mb-3" />
            <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="glass-card-solid p-5 h-[240px] bg-gray-50/50" />
      </div>

      {/* Student List Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="glass-card-solid overflow-hidden">
          <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 border-b border-gray-100/50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 w-12 bg-gray-200 rounded" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-4 border-b border-gray-100/30 last:border-0">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded hidden sm:block" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-8 bg-gray-200 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
