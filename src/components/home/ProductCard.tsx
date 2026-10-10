'use client';

import Link from 'next/link';
import { SkeletonCard, Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { toBengaliDigits } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  skeleton?: boolean;
}

/** Product Card matched to the Figma Product Card component. */
export function ProductCard({ product, skeleton = false }: ProductCardProps) {
  if (skeleton) return <SkeletonCard />;

  const pct = product.changePercent;
  const absPct = Math.abs(pct);
  const formattedPct = toBengaliDigits(absPct.toFixed(1));
  const isUp = pct > 0;
  const isDown = pct < 0;
  const arrow = isUp ? '▲' : isDown ? '▼' : '—';
  const badgeColor = isUp ? 'text-[#1A9951]' : isDown ? 'text-[#D03739]' : 'text-[#1D271F]';
  const price = toBengaliDigits(product.price.toLocaleString('en-US'));

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      aria-label={`${product.name} - আজকের দাম ${price} টাকা`}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0]" aria-hidden="true">
            <span className="text-2xl leading-none">{product.emoji || '📦'}</span>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-snug text-[#1D271F]">{product.name}</h3>
            <p className="mt-0.5 text-xs font-normal leading-normal text-[#1D271F]/80">{product.unit}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-normal leading-normal text-[#1D271F]/80">আজকের দাম</p>
            <p className="mt-0.5 leading-tight text-[#1D271F]">
              <span className="text-xl font-bold">{price}</span>{' '}
              <span className="text-sm font-medium">টাকা</span>
            </p>
          </div>
          <div
            className={`flex shrink-0 items-center gap-1 rounded-xl bg-[#F0F5F0] px-2 py-1 text-xs font-semibold ${badgeColor}`}
            aria-label={`মূল্য পরিবর্তন ${arrow} ${formattedPct}%`}
          >
            <span className="font-normal" aria-hidden="true">{arrow}</span>
            <span>{formattedPct}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  skeleton?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  skeleton = false,
  skeletonCount = 6,
  emptyMessage = 'কোনো পণ্য পাওয়া যায়নি',
  showViewAll = false,
  viewAllHref,
  viewAllText = 'সব দেখুন',
}: ProductGridProps) {
  if (skeleton) {
    return (
      <section aria-labelledby={title ? 'grid-title' : undefined} className="py-6">
        {title && (
          <div className="mb-6">
            <Skeleton variant="title" width="40%" />
            {subtitle && <Skeleton variant="text" width="60%" className="mt-2" />}
          </div>
        )}
        <SkeletonGrid columns={4} rows={Math.ceil(skeletonCount / 4)} />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section aria-labelledby={title ? 'grid-title' : undefined} className="py-12">
        {title && (
          <div className="mb-6">
            <h2 id="grid-title" className="text-heading-lg font-bold text-neutral-900">
              {title}
            </h2>
            {subtitle && <p className="text-body-md text-neutral-500 mt-1">{subtitle}</p>}
          </div>
        )}
        <EmptyState message={emptyMessage} actionHref="/" actionText="হোম পেজে ফিরে যান" />
      </section>
    );
  }

  return (
    <section aria-labelledby={title ? 'grid-title' : undefined} className="py-6">
      {(title || showViewAll) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {title && (
            <div>
              <h2 id="grid-title" className="text-heading-lg font-bold text-neutral-900">
                {title}
              </h2>
              {subtitle && <p className="text-body-md text-neutral-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {showViewAll && viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-body-md font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {viewAllText}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}

interface EmptyStateProps {
  message: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  message, 
  description, 
  actionHref, 
  actionText, 
  icon 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 lg:py-24">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-6" aria-hidden="true">
        {icon || (
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-heading-md font-semibold text-neutral-900 mb-2">{message}</h3>
      {description && <p className="text-body-md text-neutral-500 mb-6 max-w-md mx-auto">{description}</p>}
      {actionHref && actionText && (
        <Link href={actionHref}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
}