'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', children, ...props }, ref) => {
    const variantClasses = {
      success: 'bg-success-light text-success-dark',
      danger: 'bg-danger-light text-danger-dark',
      warning: 'bg-warning-light text-warning-dark',
      neutral: 'bg-neutral-100 text-neutral-600',
      primary: 'bg-primary-50 text-primary-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-caption',
      md: 'px-2.5 py-0.5 text-caption',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1 rounded-full font-medium', variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';