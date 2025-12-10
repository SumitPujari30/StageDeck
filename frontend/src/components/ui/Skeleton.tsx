import * as React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200',
          variant === 'text' && 'h-4 rounded',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-lg',
          className
        )}
        style={{ width, height }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export const SkeletonCard: React.FC = () => (
  <div className="rounded-lg border border-gray-200 p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-32" />
      </div>
    ))}
  </div>
);
