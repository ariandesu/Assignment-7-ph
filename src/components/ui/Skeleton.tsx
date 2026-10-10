'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, ...props }, ref) => {
    const variantClasses = {
      text: 'h-4 w-full rounded',
      title: 'h-6 w-3/4 rounded',
      avatar: 'h-12 w-12 rounded-full',
      card: 'aspect-square w-full rounded-xl',
      button: 'h-10 w-24 rounded-lg',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    };

    const sizeStyles: React.CSSProperties = {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    return (
      <div
        ref={ref}
        className={cn('animate-pulse bg-neutral-200', variantClasses[variant], className)}
        style={sizeStyles}
        {...props}
        aria-hidden="true"
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton variant="card" />
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ columns = 3, rows = 2 }: { columns?: number; rows?: number }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}