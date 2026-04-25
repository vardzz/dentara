import React from 'react';

export default function StudentChatsLoading() {
  return (
    <div className="flex flex-col h-full space-y-6 max-w-2xl w-full mx-auto animate-pulse pt-2 md:pt-0">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-[52px] w-full bg-gray-100 rounded-full" />

      {/* Conversation List Skeleton */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden divide-y divide-gray-50">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
              <div className="h-3 w-6 bg-gray-200 rounded" />
              <div className="h-5 w-5 rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
