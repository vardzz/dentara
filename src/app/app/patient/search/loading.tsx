import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="space-y-6">
      {/* Search Input Placeholder */}
      <Skeleton className="h-16 w-full rounded-2xl bg-gray-100" />
      
      {/* Tag pills placeholder */}
      <div className="flex gap-2 overflow-hidden py-2">
        <Skeleton className="h-10 w-24 rounded-full bg-gray-100 flex-shrink-0" />
        <Skeleton className="h-10 w-32 rounded-full bg-gray-100 flex-shrink-0" />
        <Skeleton className="h-10 w-28 rounded-full bg-gray-100 flex-shrink-0" />
        <Skeleton className="h-10 w-24 rounded-full bg-gray-100 flex-shrink-0" />
      </div>

      {/* Results grid */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
