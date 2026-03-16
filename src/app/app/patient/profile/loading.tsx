import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Search Input Placeholder */}
      <Skeleton className="h-[280px] w-full rounded-[2rem] bg-gray-100" />
      
      {/* Settings Action Blocks */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-16 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-16 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-16 w-full rounded-2xl bg-gray-100" />
        <Skeleton className="h-16 w-full rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
