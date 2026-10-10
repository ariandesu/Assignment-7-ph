/**
 * Shared API contract for the BazarDor backend (Cloudflare Workers).
 *
 * Source of truth: live responses from
 *   https://api.api-store.workers.dev/api/bazardor
 *   https://api.abcz.workers.dev/api/bazardor  (fallback, identical shape)
 *
 * Endpoints (all GET, all JSON):
 *   /products                     -> Product[]
 *   /products?category={slug}     -> Product[] ([] when slug is unknown)
 *   /products/{id}                -> Product   (404 for unknown id; slug lookup 404s — resolve slug via list)
 *   /categories                   -> Category[]
 *   /categories/{slug}            -> Category  (404 for unknown slug)
 */

/** Unit of measure for a product price. */
export type ProductUnit = "kg" | "litre" | "dozen" | "piece";

/** Direction of the latest price change. */
export type ChangeDirection = "up" | "down" | "flat";

/** Today's price range in one market. */
export interface MarketPrice {
  /** Market name in Bangla, e.g. "কারওয়ান বাজার". */
  market: string;
  /** Division the market belongs to, e.g. "ঢাকা". */
  division: string;
  /** Minimum price (BDT) seen in this market today. */
  min: number;
  /** Maximum price (BDT) seen in this market today. */
  max: number;
}

/** Price change summary relative to yesterday. */
export interface PriceChange {
  dir: ChangeDirection;
  /** Percent change, signed (e.g. -2.9 for a 2.9% drop). */
  pct: number;
}

/** A commodity product as returned by /products. */
export interface Product {
  id: number;
  slug: string;
  /** Product name in Bangla, e.g. "স্বর্ণমাছি চাল". */
  nameBn: string;
  /** Category slug, e.g. "chal". */
  category: string;
  /** Category display name in Bangla, e.g. "চাল". */
  categoryNameBn: string;
  /** Category emoji, e.g. "🍚". */
  categoryIcon: string;
  unit: ProductUnit;
  /** Product emoji/illustration, e.g. "🍚". */
  image: string;
  /** Today's representative price in BDT. */
  today: number;
  /** Yesterday's representative price in BDT. */
  yesterday: number;
  /** Representative price a week ago in BDT. */
  lastWeek: number;
  /** Representative price a month ago in BDT. */
  lastMonth: number;
  change: PriceChange;
  /** Per-market price ranges (12 markets per product in current data). */
  markets: MarketPrice[];
}

/** A category as returned by /categories. */
export interface Category {
  id: string;
  slug: string;
  /** Category name in Bangla, e.g. "চাল". */
  nameBn: string;
  /** Category emoji, e.g. "🍚". */
  icon: string;
}

/** Shape of error bodies returned by the API (e.g. {"error":"Not found"}). */
export interface ApiErrorBody {
  error: string;
}

/** Bangla unit labels used across the UI. */
export const UNIT_LABEL_BN: Record<ProductUnit, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

/** Bangla unit labels for compact price headers, e.g. "টাকা/কেজি". */
export const UNIT_SHORT_BN: Record<ProductUnit, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};
