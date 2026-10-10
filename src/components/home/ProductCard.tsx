'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard, SkeletonGrid } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatPriceChange, toBengaliDigits } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  skeleton?: boolean;
}

export function ProductCard({ product, priority = false, skeleton = false }: ProductCardProps) {
  if (skeleton) {
    return <SkeletonCard />;
  }

  const { label: changeLabel, direction } = formatPriceChange(product.changePercent);

  return (
    <Link href={`/product/${product.id}`} className="block" aria-label={`${product.name} - ${formatPrice(product.price)}`}>
      <Card variant="hover" padding="none">
        {/* Product Image/Emoji */}
        <div className="aspect-square bg-neutral-50 flex items-center justify-center overflow-hidden relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <span className="text-5xl lg:text-6xl" aria-hidden="true">{product.emoji || '📦'}</span>
          )}
          
          {/* Change Badge Overlay */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                direction === 'up' ? 'success' :
                direction === 'down' ? 'danger' : 'neutral'
              }
              size="sm"
            >
              {changeLabel}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <h3 className="text-heading-sm font-semibold text-neutral-900 line-clamp-1 mb-1">
            {product.name}
          </h3>
          
          <p className="text-body-sm text-neutral-500 mb-2">
            {product.unit}
          </p>

          {/* Price Row */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-caption text-neutral-500">আজকের দাম</span>
              <p className="text-heading-md font-bold text-neutral-900">
                {formatPrice(product.price)}
              </p>
            </div>
            
            {/* Unit badge */}
            <Badge variant="primary" size="sm">
              {toBengaliDigits(product.unit.includes('কেজি') ? 'কেজি' : 
                product.unit.includes('লিটার') ? 'লিটার' :
                product.unit.includes('ডজন') ? 'ডজন' : 'পিস')}
            </Badge>
          </div>
        </CardContent>
      </Card>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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