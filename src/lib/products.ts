/**
 * Pure product-domain helpers shared by every page (home, category, detail).
 *
 * These are deliberately framework-free and synchronous so both server and
 * client code can use them and they stay trivial to unit test. Sorting and
 * comparisons always use NUMERIC values ("today" etc.), never formatted
 * Bengali strings — see src/lib/bn.ts#toNumericPrice for the parsing side of
 * that contract when strings do come into play.
 */

import type { MarketPrice, Product } from "@/lib/types";

/** Today's top risers (change.dir === "up"), biggest percentage first. */
export function topRisers(products: Product[], limit = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);
}

/** Today's top fallers (change.dir === "down"), biggest drop first. */
export function topFallers(products: Product[], limit = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit);
}

/** Sort options surfaced on the category page dropdown ("ডিফল্ট", price asc/desc). */
export type ProductSort = "default" | "price-asc" | "price-desc";

/** Numeric price sort (Bengali-safe inputs handled upstream in lib/bn.ts). */
export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  if (sort === "default") return [...products];
  const direction = sort === "price-asc" ? 1 : -1;
  return [...products].sort((a, b) => (a.today - b.today) * direction);
}

/** Find a product by its slug (used to resolve /product/[slug] routes). */
export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export interface MarketStats {
  /** Lowest min-price across all markets (BDT). */
  min: number;
  /** Highest max-price across all markets (BDT). */
  max: number;
  /** Mean of per-market midpoints, rounded to 2 decimals (BDT). */
  avg: number;
  marketCount: number;
}

/** Min / max / average summary shown on the product detail page. */
export function marketStats(product: Product): MarketStats {
  const markets = product.markets;
  if (markets.length === 0) {
    return { min: product.today, max: product.today, avg: product.today, marketCount: 0 };
  }
  const min = Math.min(...markets.map((m) => m.min));
  const max = Math.max(...markets.map((m) => m.max));
  const midpointSum = markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0);
  const avg = Math.round((midpointSum / markets.length) * 100) / 100;
  return { min, max, avg, marketCount: markets.length };
}

/** Market where the product is cheapest (lowest min-price; first wins ties). */
export function cheapestMarket(product: Product): MarketPrice | undefined {
  return product.markets.reduce<MarketPrice | undefined>(
    (best, market) => (best === undefined || market.min < best.min ? market : best),
    undefined,
  );
}

/** Market where the product is most expensive (highest max-price; first wins ties). */
export function priciestMarket(product: Product): MarketPrice | undefined {
  return product.markets.reduce<MarketPrice | undefined>(
    (best, market) => (best === undefined || market.max > best.max ? market : best),
    undefined,
  );
}

/** Number of distinct markets across the given products (hero stat + ticker meta). */
export function countUniqueMarkets(products: Product[]): number {
  const names = new Set<string>();
  for (const product of products) {
    for (const market of product.markets) {
      names.add(market.market);
    }
  }
  return names.size;
}
