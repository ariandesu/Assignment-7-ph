import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCategories,
  getCategoryBySlug,
  getProductById,
  getProductBySlug,
  getProducts,
  isCategory,
  isProduct,
} from "@/lib/api/endpoints";
import { ApiError, FALLBACK_BASE_URL, PRIMARY_BASE_URL } from "@/lib/api/client";
import { categoryFixtures, sornoMachiChal } from "@/lib/test-fixtures";

const PRODUCTS_URL = `${PRIMARY_BASE_URL}/products`;
const CATEGORIES_URL = `${PRIMARY_BASE_URL}/categories`;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

function route(map: Record<string, () => Promise<Response>>): void {
  fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const handler = map[url];
    if (!handler) throw new TypeError(`fetch failed for ${url}`);
    return handler();
  });
}

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getProducts", () => {
  it("returns validated products from the primary", async () => {
    route({ [PRODUCTS_URL]: async () => jsonResponse([sornoMachiChal]) });
    const products = await getProducts();
    expect(products).toHaveLength(1);
    expect(products[0]?.nameBn).toBe("স্বর্ণমাছি চাল");
  });

  it("appends the category query parameter", async () => {
    route({ [`${PRODUCTS_URL}?category=chal`]: async () => jsonResponse([sornoMachiChal]) });
    const products = await getProducts({ category: "chal" });
    expect(products).toHaveLength(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(`${PRODUCTS_URL}?category=chal`);
  });

  it("URL-encodes category slugs", async () => {
    route({ [`${PRODUCTS_URL}?category=dim-dui`]: async () => jsonResponse([]) });
    await getProducts({ category: "dim-dui" });
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(`${PRODUCTS_URL}?category=dim-dui`);
  });

  it("returns [] when the API returns an empty list", async () => {
    route({ [`${PRODUCTS_URL}?category=nope`]: async () => jsonResponse([]) });
    await expect(getProducts({ category: "nope" })).resolves.toEqual([]);
  });

  it("rejects wrong-shape bodies with a parse error even when the fallback answers", async () => {
    route({
      [PRODUCTS_URL]: async () => jsonResponse({ products: "not an array" }),
      [`${FALLBACK_BASE_URL}/products`]: async () => jsonResponse({ products: "still wrong" }),
    });
    const error = (await getProducts().catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("parse");
    // Both hosts returned a body that breaks the contract; both were tried.
    expect(error.triedUrls).toHaveLength(2);
  });
});

describe("getProductById / getProductBySlug", () => {
  it("fetches a single product by numeric id", async () => {
    route({ [`${PRODUCTS_URL}/1`]: async () => jsonResponse(sornoMachiChal) });
    const product = await getProductById(1);
    expect(product.slug).toBe("sorno-machi-chal");
  });

  it("surfaces 404 as a non-retryable notFound without hitting the fallback", async () => {
    route({ [`${PRODUCTS_URL}/9999`]: async () => jsonResponse({ error: "Not found" }, 404) });
    const error = (await getProductById(9999).catch((e: unknown) => e)) as ApiError;
    expect(error.kind).toBe("notFound");
    expect(error.retryable).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("resolves a slug against the product list (API has no slug endpoint)", async () => {
    route({ [PRODUCTS_URL]: async () => jsonResponse([sornoMachiChal]) });
    const product = await getProductBySlug("sorno-machi-chal");
    expect(product.id).toBe(1);
  });

  it("throws notFound ApiError for an unknown slug", async () => {
    route({ [PRODUCTS_URL]: async () => jsonResponse([sornoMachiChal]) });
    const error = (await getProductBySlug("nope").catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("notFound");
    expect(error.status).toBe(404);
  });
});

describe("getCategories / getCategoryBySlug", () => {
  it("fetches all categories", async () => {
    route({ [CATEGORIES_URL]: async () => jsonResponse(categoryFixtures) });
    const categories = await getCategories();
    expect(categories.map((c) => c.slug)).toEqual(["chal", "sobji", "mach"]);
  });

  it("fetches a single category by slug", async () => {
    route({ [`${CATEGORIES_URL}/chal`]: async () => jsonResponse(categoryFixtures[0]) });
    await expect(getCategoryBySlug("chal")).resolves.toMatchObject({ nameBn: "চাল", icon: "🍚" });
  });

  it("surfaces unknown category 404 without fallback", async () => {
    route({ [`${CATEGORIES_URL}/nope`]: async () => jsonResponse({ error: "Not found" }, 404) });
    const error = (await getCategoryBySlug("nope").catch((e: unknown) => e)) as ApiError;
    expect(error.kind).toBe("notFound");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("runtime guards", () => {
  it("accepts real-shaped products/categories", () => {
    expect(isProduct(sornoMachiChal)).toBe(true);
    expect(isCategory(categoryFixtures[0])).toBe(true);
  });

  it("rejects broken shapes", () => {
    expect(isProduct(null)).toBe(false);
    expect(isProduct({ ...sornoMachiChal, unit: "metre" })).toBe(false);
    expect(isProduct({ ...sornoMachiChal, change: { dir: "sideways", pct: 1 } })).toBe(false);
    expect(isCategory({ id: "chal", slug: "chal" })).toBe(false);
  });
});
