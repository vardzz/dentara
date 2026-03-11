import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[220px] w-full rounded-[2rem] bg-gray-100" />
      
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <Skeleton className="h-64 w-64 rounded-full bg-gray-100" />
      </div>

      <div className="space-y-3 pt-6">
        <div className="flex justify-between">
          <Skeleton className="h-[120px] w-[48%] rounded-2xl bg-gray-100" />
          <Skeleton className="h-[120px] w-[48%] rounded-2xl bg-gray-100" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
