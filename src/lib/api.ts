import {
  getCategories,
  getCategoryBySlug,
  getProductById,
  getProductBySlug,
  getProducts,
} from '@/lib/api/endpoints';
import { formatBnChange, formatBnDate, formatBnTaka, formatBnPrice } from '@/lib/bn';
import { marketStats } from '@/lib/products';
import { UNIT_LABEL_BN, UNIT_SHORT_BN } from '@/lib/types';
import type { Product as ApiProduct } from '@/lib/types';
import type { Category, Product, SortOption } from '@/types';

function normalizeProduct(product: ApiProduct): Product {
  const stats = marketStats(product);
  const unit = UNIT_LABEL_BN[product.unit];
  return {
    id: product.id,
    slug: product.slug,
    name: product.nameBn,
    nameBn: product.nameBn,
    emoji: product.image || product.categoryIcon || '📦',
    image: undefined,
    unit,
    category: product.categoryNameBn,
    categorySlug: product.category,
    price: product.today,
    minPrice: stats.min,
    maxPrice: stats.max,
    avgPrice: stats.avg,
    changePercent: product.change.pct,
    changeDirection: product.change.dir,
    markets: product.markets.map((market) => ({
      ...market,
      price: Math.round((market.min + market.max) / 2),
      unit,
    })),
    description: `${product.categoryNameBn} ক্যাটাগরির ${unit} বাজারদর।`,
  };
}

function normalizeCategory(category: Awaited<ReturnType<typeof getCategories>>[number]): Category {
  return {
    slug: category.slug,
    name: category.nameBn,
    nameBn: category.nameBn,
    emoji: category.icon,
    icon: category.icon,
  };
}

export const api = {
  async getProducts(): Promise<Product[]> {
    return (await getProducts()).map(normalizeProduct);
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    return (await getProducts({ category: categorySlug })).map(normalizeProduct);
  },

  async getProduct(idOrSlug: string | number): Promise<Product> {
    const product = typeof idOrSlug === 'number' || /^\d+$/.test(String(idOrSlug))
      ? await getProductById(Number(idOrSlug))
      : await getProductBySlug(String(idOrSlug));
    return normalizeProduct(product);
  },

  async getCategories(): Promise<Category[]> {
    return (await getCategories()).map(normalizeCategory);
  },

  async getCategory(slug: string): Promise<{ category: Category; products: Product[] }> {
    const [category, products] = await Promise.all([
      getCategoryBySlug(slug),
      getProducts({ category: slug }),
    ]);
    return {
      category: normalizeCategory(category),
      products: products.map(normalizeProduct),
    };
  },
};

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  if (sortOption === 'default') return [...products];
  const direction = sortOption === 'price-asc' ? 1 : -1;
  return [...products].sort((a, b) => (a.price - b.price) * direction);
}

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);
}

export function formatPrice(price: number): string {
  return formatBnTaka(price);
}

export function formatPriceChange(changePercent: number): {
  label: string;
  direction: 'up' | 'down' | 'flat';
} {
  const direction = changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'flat';
  return {
    label: formatBnChange(direction, changePercent),
    direction,
  };
}

export function getBanglaDate(): string {
  return formatBnDate();
}

export { formatBnPrice, UNIT_SHORT_BN };
export type { Product, Category, SortOption } from '@/types';
