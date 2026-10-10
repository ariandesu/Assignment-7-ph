import type { Product as ApiProduct, Category as ApiCategory, MarketPrice as ApiMarketPrice } from '@/lib/types';

export interface MarketPrice extends ApiMarketPrice {
  /** Representative midpoint used by the UI table. */
  price: number;
  unit: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  nameBn: string;
  emoji: string;
  image?: string;
  unit: string;
  category: string;
  categorySlug: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'flat';
  markets: MarketPrice[];
  description?: string;
}

export interface Category {
  slug: string;
  name: string;
  nameBn: string;
  emoji: string;
  icon?: string;
  productCount?: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc';
export type ChangeDirection = 'up' | 'down' | 'flat';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
}

export interface Session {
  user: User;
  expires: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type NativeApiProduct = ApiProduct;
export type NativeApiCategory = ApiCategory;
