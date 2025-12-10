import * as React from 'react';
import { cn } from '@/utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

const variantColors = {
  default: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn('h-full transition-all duration-300 ease-in-out', variantColors[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="mt-1 text-xs text-gray-600">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
