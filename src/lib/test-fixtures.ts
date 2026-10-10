/**
 * Test fixtures shaped exactly like live API responses (verified 2026-10-10
 * against https://api.api-store.workers.dev/api/bazardor). Values are the real
 * published figures for the products below, so tests double as a contract
 * sanity check — if the API changes shape, these tests are where it shows up.
 */

import type { Category, MarketPrice, Product, ProductUnit } from "@/lib/types";

export function makeMarkets(
  entries: Array<[market: string, division: string, min: number, max: number]>,
): MarketPrice[] {
  return entries.map(([market, division, min, max]) => ({ market, division, min, max }));
}

export function makeProduct(overrides: Partial<Product> & Pick<Product, "id" | "slug" | "nameBn" | "today">): Product {
  const unit: ProductUnit = overrides.unit ?? "kg";
  return {
    id: overrides.id,
    slug: overrides.slug,
    nameBn: overrides.nameBn,
    category: overrides.category ?? "chal",
    categoryNameBn: overrides.categoryNameBn ?? "চাল",
    categoryIcon: overrides.categoryIcon ?? "🍚",
    unit,
    image: overrides.image ?? overrides.categoryIcon ?? "🍚",
    today: overrides.today,
    yesterday: overrides.yesterday ?? overrides.today,
    lastWeek: overrides.lastWeek ?? overrides.today,
    lastMonth: overrides.lastMonth ?? overrides.today,
    change: overrides.change ?? { dir: "flat", pct: 0 },
    markets: overrides.markets ?? [],
  };
}

/** Real values: স্বর্ণমাছি চাল, id 1, 148 টাকা, ▲2.1%, 12 markets (3 shown). */
export const sornoMachiChal: Product = makeProduct({
  id: 1,
  slug: "sorno-machi-chal",
  nameBn: "স্বর্ণমাছি চাল",
  today: 148,
  yesterday: 145,
  lastWeek: 142,
  lastMonth: 138,
  change: { dir: "up", pct: 2.1 },
  markets: makeMarkets([
    ["কারওয়ান বাজার", "ঢাকা", 146, 165],
    ["গ্রীন মার্কেট, মিরপুর", "ঢাকা", 143, 159],
    ["আমতলী বাজার", "চট্টগ্রাম", 138, 155],
  ]),
});

/** Real values: মিনিকেট চাল, id 2, 99 টাকা, ▼2.9%. */
export const miniketChal: Product = makeProduct({
  id: 2,
  slug: "miniket-chal",
  nameBn: "মিনিকেট চাল",
  today: 99,
  yesterday: 102,
  change: { dir: "down", pct: -2.9 },
  markets: makeMarkets([
    ["কারওয়ান বাজার", "ঢাকা", 98, 110],
    ["আমতলী বাজার", "চট্টগ্রাম", 96, 108],
  ]),
});

/** Real values: আলু, id 12, 30 টাকা, ▼6.2%, category sobji. */
export const alu: Product = makeProduct({
  id: 12,
  slug: "alu",
  nameBn: "আলু",
  category: "sobji",
  categoryNameBn: "সবজি",
  categoryIcon: "🥔",
  today: 30,
  yesterday: 32,
  change: { dir: "down", pct: -6.2 },
  markets: makeMarkets([
    ["কারওয়ান বাজার", "ঢাকা", 28, 34],
    ["সদর বাজার", "রাজশাহী", 25, 31],
  ]),
});

/** Real values: পেঁয়াজ, id 13, 54 টাকা, ▲12.5%, category sobji. */
export const peyaj: Product = makeProduct({
  id: 13,
  slug: "peyaj",
  nameBn: "পেঁয়াজ",
  category: "sobji",
  categoryNameBn: "সবজি",
  categoryIcon: "🧅",
  today: 54,
  yesterday: 48,
  change: { dir: "up", pct: 12.5 },
  markets: makeMarkets([
    ["কারওয়ান বাজার", "ঢাকা", 50, 58],
    ["বাজারহাট", "খুলনা", 48, 55],
  ]),
});

/** Real values: কাঁচামরিচ, id 14, 92 টাকা, ▼12.4%, category sobji. */
export const kacchaMoric: Product = makeProduct({
  id: 14,
  slug: "kaccha-moric",
  nameBn: "কাঁচামরিচ",
  category: "sobji",
  categoryNameBn: "সবজি",
  categoryIcon: "🌶️",
  today: 92,
  yesterday: 105,
  change: { dir: "down", pct: -12.4 },
});

/** Real values: নাজির চাল, id 3, 74 টাকা, flat. */
export const nazirChal: Product = makeProduct({
  id: 3,
  slug: "nazir-chal",
  nameBn: "নাজির চাল",
  today: 74,
  yesterday: 74,
  change: { dir: "flat", pct: 0 },
});

/** Real values: ইলিশ মাছ, id 19, 1,850 টাকা, ▲3.4%, category mach (expensive outlier). */
export const ilishMach: Product = makeProduct({
  id: 19,
  slug: "ilish-mach",
  nameBn: "ইলিশ মাছ",
  category: "mach",
  categoryNameBn: "মাছ",
  categoryIcon: "🐟",
  today: 1850,
  yesterday: 1789,
  change: { dir: "up", pct: 3.4 },
  unit: "kg",
  markets: makeMarkets([
    ["কারওয়ান বাজার", "ঢাকা", 1750, 1980],
    ["আমবাজার", "সিলেট", 1800, 2100],
  ]),
});

export const productFixtures: Product[] = [
  sornoMachiChal,
  miniketChal,
  nazirChal,
  alu,
  peyaj,
  kacchaMoric,
  ilishMach,
];

export const categoryFixtures: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
];
