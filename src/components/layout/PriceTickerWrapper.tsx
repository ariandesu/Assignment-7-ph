'use client';

import { PriceTicker as PriceTickerClient } from '@/components/layout/PriceTicker';
import type { Product } from '@/types';

interface PriceTickerWrapperProps {
  products: Product[];
}

export function PriceTickerWrapper({ products }: PriceTickerWrapperProps) {
  return <PriceTickerClient products={products} />;
}