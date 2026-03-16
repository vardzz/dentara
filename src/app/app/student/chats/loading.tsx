import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <Skeleton className="h-8 w-24 rounded-lg bg-gray-100" />
        <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
      </div>

      <div className="space-y-4 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full bg-gray-100 flex-shrink-0" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-3/4 rounded bg-gray-100" />
              <Skeleton className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
            <Skeleton className="h-3 w-8 rounded bg-gray-100 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
