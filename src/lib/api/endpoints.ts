/**
 * Typed endpoint functions for the BazarDor API.
 *
 * Every function goes through requestJson (primary → fallback failover, see
 * client.ts) and passes its runtime guard as the `validate` option, so shape
 * validation runs per-attempt INSIDE the failover loop: a host returning a
 * wrong-shaped body is treated like any other retryable failure and the
 * fallback host gets its chance.
 *
 * Live contract notes (verified against both hosts, 2026-10-10):
 *   - GET /products               -> Product[]
 *   - GET /products?category=slug -> Product[] ([] for unknown slug)
 *   - GET /products/{id}          -> Product   (numeric id only; slugs 404)
 *   - GET /categories             -> Category[]
 *   - GET /categories/{slug}      -> Category  (404 for unknown slug)
 *   - Unknown product/slug/category -> 404 {"error":"Not found"} (no fallback, per policy)
 */

import { ApiError, requestJson, type ApiRequestOptions } from "./client";
import type { Category, ChangeDirection, Product, ProductUnit } from "@/lib/types";

const CHANGE_DIRS: readonly ChangeDirection[] = ["up", "down", "flat"];
const UNITS: readonly ProductUnit[] = ["kg", "litre", "dozen", "piece"];

/**
 * Runtime guard for a Product. Required-field checks only — additive API
 * changes (new optional fields) do not break rendering.
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  if (
    typeof p.id !== "number" ||
    typeof p.slug !== "string" ||
    typeof p.nameBn !== "string" ||
    typeof p.category !== "string" ||
    typeof p.categoryNameBn !== "string" ||
    typeof p.unit !== "string" ||
    !(UNITS as readonly string[]).includes(p.unit) ||
    typeof p.today !== "number" ||
    typeof p.yesterday !== "number" ||
    typeof p.lastWeek !== "number" ||
    typeof p.lastMonth !== "number" ||
    !Array.isArray(p.markets)
  ) {
    return false;
  }
  const change = p.change as Record<string, unknown> | null | undefined;
  if (
    typeof change !== "object" ||
    change === null ||
    typeof change.dir !== "string" ||
    !(CHANGE_DIRS as readonly string[]).includes(change.dir) ||
    typeof change.pct !== "number"
  ) {
    return false;
  }
  return true;
}

/** Runtime guard for a Category. */
export function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.slug === "string" &&
    typeof c.nameBn === "string" &&
    typeof c.icon === "string"
  );
}

/** Runtime guard for a Product[]. */
export function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

/** Runtime guard for a Category[]. */
export function isCategoryArray(value: unknown): value is Category[] {
  return Array.isArray(value) && value.every(isCategory);
}

export interface GetProductsOptions extends ApiRequestOptions {
  /** Category slug to filter by, e.g. "chal". Omit for all products. */
  category?: string;
}

/** GET /products — all products, or one category when `category` is given. */
export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const { category, ...requestOptions } = options;
  const query = category ? `?${new URLSearchParams({ category }).toString()}` : "";
  return requestJson<Product[]>(`/products${query}`, {
    ...requestOptions,
    validate: isProductArray,
    expected: "Product[]",
  });
}

/** GET /products/{id} — single product by numeric id (404 → ApiError kind "notFound"). */
export async function getProductById(id: number, options?: ApiRequestOptions): Promise<Product> {
  return requestJson<Product>(`/products/${encodeURIComponent(String(id))}`, {
    ...options,
    validate: isProduct,
    expected: "Product",
  });
}

/**
 * Resolve a product by its slug.
 *
 * The API only resolves numeric ids on /products/{id} (verified: slugs 404 on
 * both hosts), so slugs are resolved against the product list. Throws ApiError
 * kind "notFound" when the slug does not exist.
 */
export async function getProductBySlug(slug: string, options?: ApiRequestOptions): Promise<Product> {
  const products = await getProducts(options);
  const found = products.find((product) => product.slug === slug);
  if (!found) {
    throw new ApiError({
      kind: "notFound",
      status: 404,
      retryable: false,
      message: `No product with slug "${slug}".`,
    });
  }
  return found;
}

/** GET /categories — all category metadata. */
export async function getCategories(options?: ApiRequestOptions): Promise<Category[]> {
  return requestJson<Category[]>("/categories", {
    ...options,
    validate: isCategoryArray,
    expected: "Category[]",
  });
}

/** GET /categories/{slug} — single category (404 → ApiError kind "notFound"). */
export async function getCategoryBySlug(slug: string, options?: ApiRequestOptions): Promise<Category> {
  return requestJson<Category>(`/categories/${encodeURIComponent(slug)}`, {
    ...options,
    validate: isCategory,
    expected: "Category",
  });
}
