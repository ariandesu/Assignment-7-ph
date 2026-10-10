// API Client with primary/fallback failover logic
// BASE_URL_1: https://api.api-store.workers.dev/api/bazardor
// BASE_URL_2: https://api.abcz.workers.dev/api/bazardor (alternative)

import type { Product, Category, ProductsResponse, CategoryResponse, SingleProductResponse, SingleCategoryResponse, SortOption } from '@/types';

const BASE_URL_1 = 'https://api.api-store.workers.dev/api/bazardor';
const BASE_URL_2 = 'https://api.abcz.workers.dev/api/bazardor';

type BaseUrl = typeof BASE_URL_1 | typeof BASE_URL_2;

interface FetchOptions extends RequestInit {
  baseUrl?: BaseUrl;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithFallback<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { baseUrl, ...fetchOptions } = options;
  const urls = baseUrl ? [baseUrl] : [BASE_URL_1, BASE_URL_2];
  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(`${url}${endpoint}`, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        // Add timeout
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new ApiError(
            `Server error: ${response.status}`,
            response.status,
            `${url}${endpoint}`
          );
        }
        throw new ApiError(
          `HTTP error: ${response.status}`,
          response.status,
          `${url}${endpoint}`
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;
      
      // If it's a network error or 5xx, try the next URL
      if (
        error instanceof ApiError && 
        error.status >= 500
      ) {
        continue;
      }
      
      // For client errors (4xx), don't fallback - throw immediately
      if (error instanceof ApiError && error.status < 500) {
        throw error;
      }
      
      // Network errors - try fallback
      if (error instanceof TypeError && error.message.includes('fetch')) {
        continue;
      }
      
      // Timeout - try fallback
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        continue;
      }
      
      // Other errors - throw
      throw error;
    }
  }

  // If we exhausted all URLs, throw the last error
  throw lastError || new Error('All API endpoints failed');
}

export const api = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetchWithFallback<ProductsResponse>('/products');
    return response.products || response;
  },

  // Get products by category
  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    const response = await fetchWithFallback<ProductsResponse>(
      `/products?category=${encodeURIComponent(categorySlug)}`
    );
    return response.products || response;
  },

  // Get single product
  getProduct: async (id: string | number): Promise<Product> => {
    const response = await fetchWithFallback<SingleProductResponse>(`/products/${id}`);
    return response.product || response;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await fetchWithFallback<CategoryResponse>('/categories');
    return response.categories || response;
  },

  // Get single category with products
  getCategory: async (slug: string): Promise<{ category: Category; products: Product[] }> => {
    const response = await fetchWithFallback<SingleCategoryResponse>(`/categories/${encodeURIComponent(slug)}`);
    return {
      category: response.category,
      products: response.products || [],
    };
  },
};

// Client-side sorting utilities
export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'default':
    default:
      return sorted;
  }
}

// Bengali numeral conversion
export function toBengaliDigits(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Format price with Bengali digits and currency
export function formatPrice(price: number): string {
  return `${toBengaliDigits(price.toLocaleString('bn-BD'))} টাকা`;
}

// Format price change with Bengali digits
export function formatPriceChange(changePercent: number): { label: string; direction: 'up' | 'down' | 'flat' } {
  const absChange = Math.abs(changePercent);
  const formatted = toBengaliDigits(absChange.toFixed(1));
  
  if (changePercent > 0) {
    return { label: `▲ ${formatted}%`, direction: 'up' };
  } else if (changePercent < 0) {
    return { label: `▼ ${formatted}%`, direction: 'down' };
  }
  return { label: `—${formatted}%`, direction: 'flat' };
}

// Get Bangla date string
export function getBanglaDate(): string {
  const now = new Date();
  const banglaMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];
  
  // Approximate conversion - in production, use a proper Bangla calendar library
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear() - 593; // Approximate Bengali year
  
  return `${banglaMonths[month]} ${toBengaliDigits(day)}, ${toBengaliDigits(year)}`;
}