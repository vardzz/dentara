import React from 'react';

export default function StudentHomeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="pt-2">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-8 w-64 bg-gray-200 rounded" />
      </div>

      {/* Alerts Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card-solid p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-2 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Quota Progress Skeleton */}
      <div>
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="glass-card-solid p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Cases Skeleton */}
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

      {/* Past Activities Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
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
