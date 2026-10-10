// Type definitions for BazarDor API data structures

export interface Product {
  id: number | string;
  name: string;
  emoji?: string;
  image?: string;
  unit: string;
  category: string;
  categorySlug: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'flat';
  markets?: MarketPrice[];
  description?: string;
}

export interface MarketPrice {
  market: string;
  price: number;
  unit: string;
}

export interface Category {
  slug: string;
  name: string;
  nameBn: string;
  emoji: string;
  icon?: string;
  productCount?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface SingleProductResponse {
  product: Product;
}

export interface SingleCategoryResponse {
  category: Category;
  products: Product[];
}

export interface ApiError {
  message: string;
  status: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export type ChangeDirection = 'up' | 'down' | 'flat';

export interface PriceChange {
  value: number;
  direction: ChangeDirection;
  label: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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