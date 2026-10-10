'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface PriceTickerProps {
  products: Product[];
  paused?: boolean;
}

export function PriceTicker({ products, paused = false }: PriceTickerProps) {
  const displayProducts = products.length > 0 ? [...products, ...products] : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || paused) return;

    let position = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!paused) {
        position -= speed;
        if (Math.abs(position) >= container.scrollWidth / 2) {
          position = 0;
        }
        container.style.transform = `translateX(${position}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [paused]);

  // Pause on hover
  const handleMouseEnter = () => {
    // The pause is handled by the parent via the paused prop
  };

  const handleMouseLeave = () => {
    // Resume handled by parent
  };

  if (displayProducts.length === 0) {
    return (
      <div className="bg-accent-50 border-y border-accent-200 py-3" aria-hidden="true">
        <div className="container-main">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-5 w-24 bg-accent-200 rounded" />
            <div className="h-5 w-32 bg-accent-200 rounded" />
            <div className="h-5 w-20 bg-accent-200 rounded" />
            <div className="h-5 w-16 bg-accent-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-accent-50 border-y border-accent-200 py-3 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-live="polite"
      aria-label="দাম টিকার"
    >
      <div
        ref={containerRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        {displayProducts.map((product, index) => (
          <span
            key={`${product.id}-${index}`}
            className="flex items-center gap-2 px-4 text-body-sm text-neutral-700"
          >
            <span aria-hidden="true">{product.emoji || '📦'}</span>
            <span className="font-medium">{product.name}</span>
            <span className="text-accent-600 font-semibold">
              {formatPrice(product.price)} / {product.unit}
            </span>
            <span
              className={cn(
                'font-medium',
                product.changeDirection === 'up' && 'text-success',
                product.changeDirection === 'down' && 'text-danger',
                product.changeDirection === 'flat' && 'text-neutral-500'
              )}
            >
              {formatPriceChange(product.changePercent).label}
            </span>
            <span className="text-neutral-300 mx-2" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(price.toLocaleString('bn-BD')).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
}

function formatPriceChange(changePercent: number): { label: string; direction: 'up' | 'down' | 'flat' } {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const absChange = Math.abs(changePercent);
  const formatted = String(absChange.toFixed(1)).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
  
  if (changePercent > 0) {
    return { label: `▲ ${formatted}%`, direction: 'up' };
  } else if (changePercent < 0) {
    return { label: `▼ ${formatted}%`, direction: 'down' };
  }
  return { label: `—${formatted}%`, direction: 'flat' };
}