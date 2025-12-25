import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSkeleton = memo(function LoadingSkeleton(): React.ReactElement {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex gap-4">
          {/* Thumbnail skeleton */}
          <Skeleton className="w-32 h-18 rounded-md shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />
            {/* Channel and duration skeleton */}
            <Skeleton className="h-4 w-1/2" />
            {/* Action buttons skeleton */}
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and badges skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-24" />
        </div>
        {/* Transcript area skeleton */}
        <Skeleton className="h-[400px] w-full rounded-md" />
      </CardContent>
    </Card>
  );
});
