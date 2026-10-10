'use client';

import { useEffect, useState } from 'react';
import { PriceTicker as PriceTickerClient } from '@/components/layout/PriceTicker';
import type { Product } from '@/types';

interface PriceTickerWrapperProps {
  products: Product[];
}

export function PriceTickerWrapper({ products }: PriceTickerWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
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
  
  return <PriceTickerClient products={products} />;
}