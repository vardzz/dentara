import React from 'react';

export default function UniversityProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="glass-card-solid p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gray-200 mx-auto mb-3" />
        <div className="h-6 w-48 bg-gray-200 mx-auto mb-2" />
        <div className="h-3 w-32 bg-gray-200 mx-auto mb-4" />
        <div className="flex justify-center gap-4">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Info List Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Skeleton */}
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
        <div className="glass-card-solid divide-y divide-gray-100/30">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-2 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Skeleton */}
      <div className="glass-card-solid p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
