import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      {/* Date header placeholder */}
      <div className="flex justify-between items-center pb-2">
        <Skeleton className="h-8 w-40 rounded-full bg-gray-100" />
        <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
      </div>

      {/* Vertical Timeline Items */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-full w-0.5 bg-gray-100" />
          <Skeleton className="h-28 w-full rounded-2xl bg-gray-100" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-full w-0.5 bg-gray-100" />
          <Skeleton className="h-28 w-full rounded-2xl bg-gray-100" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-full w-0.5 bg-gray-100" />
          <Skeleton className="h-28 w-full rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
