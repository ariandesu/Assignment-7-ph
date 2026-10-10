import { describe, expect, it } from "vitest";
import {
  cheapestMarket,
  countUniqueMarkets,
  findProductBySlug,
  marketStats,
  priciestMarket,
  sortProducts,
  topFallers,
  topRisers,
} from "@/lib/products";
import { alu, ilishMach, kacchaMoric, nazirChal, peyaj, productFixtures, sornoMachiChal } from "@/lib/test-fixtures";
import { toNumericPrice } from "@/lib/bn";

describe("topRisers / topFallers", () => {
  it("sorts risers by biggest positive pct and honors the limit", () => {
    const risers = topRisers(productFixtures, 3);
    expect(risers.map((p) => p.nameBn)).toEqual(["পেঁয়াজ", "ইলিশ মাছ", "স্বর্ণমাছি চাল"]);
    expect(risers.map((p) => p.change.pct)).toEqual([12.5, 3.4, 2.1]);
  });

  it("sorts fallers by biggest drop and excludes flat/up", () => {
    const fallers = topFallers(productFixtures, 6);
    expect(fallers.map((p) => p.nameBn)).toEqual(["কাঁচামরিচ", "আলু", "মিনিকেট চাল"]);
    expect(fallers.every((p) => p.change.dir === "down")).toBe(true);
  });

  it("returns everything when fewer items than the limit exist", () => {
    expect(topRisers([peyaj], 6)).toHaveLength(1);
    expect(topFallers([nazirChal], 6)).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [...productFixtures];
    topRisers(input, 2);
    expect(input).toEqual(productFixtures);
  });
});

describe("sortProducts", () => {
  it("default keeps API order", () => {
    expect(sortProducts(productFixtures, "default").map((p) => p.id)).toEqual(productFixtures.map((p) => p.id));
  });

  it("sorts price ascending", () => {
    const sorted = sortProducts([ilishMach, alu, peyaj], "price-asc");
    expect(sorted.map((p) => p.today)).toEqual([30, 54, 1850]);
  });

  it("sorts price descending", () => {
    const sorted = sortProducts([ilishMach, alu, peyaj], "price-desc");
    expect(sorted.map((p) => p.today)).toEqual([1850, 54, 30]);
  });
});

describe("findProductBySlug", () => {
  it("finds by slug and returns undefined otherwise", () => {
    expect(findProductBySlug(productFixtures, "alu")?.nameBn).toBe("আলু");
    expect(findProductBySlug(productFixtures, "nope")).toBeUndefined();
  });
});

describe("marketStats", () => {
  it("computes min/max/avg from real market ranges", () => {
    // স্বর্ণমাছি চাল: (146..165), (143..159), (138..155)
    // min = 138, max = 165, avg = mean of midpoints = (155.5 + 151 + 146.5) / 3
    const stats = marketStats(sornoMachiChal);
    expect(stats.min).toBe(138);
    expect(stats.max).toBe(165);
    expect(stats.avg).toBeCloseTo((155.5 + 151 + 146.5) / 3, 5);
    expect(stats.marketCount).toBe(3);
  });

  it("falls back to today's price when a product has no markets", () => {
    const stats = marketStats(nazirChal);
    expect(stats).toEqual({ min: 74, max: 74, avg: 74, marketCount: 0 });
  });

  it("handles the expensive outlier correctly", () => {
    const stats = marketStats(ilishMach);
    expect(stats.min).toBe(1750);
    expect(stats.max).toBe(2100);
  });
});

describe("cheapestMarket / priciestMarket", () => {
  it("finds extreme markets by their range", () => {
    expect(cheapestMarket(sornoMachiChal)?.market).toBe("আমতলী বাজার");
    expect(priciestMarket(sornoMachiChal)?.market).toBe("কারওয়ান বাজার");
  });

  it("returns undefined without markets", () => {
    expect(cheapestMarket(nazirChal)).toBeUndefined();
    expect(priciestMarket(nazirChal)).toBeUndefined();
  });
});

describe("countUniqueMarkets", () => {
  it("counts distinct market names across products", () => {
    // sworno: কারওয়ান, গ্রীন, আমতলী | alu: কারওয়ান, সদর | peyaj: কারওয়ান(dup), বাজারহাট
    // distinct = {কারওয়ান, গ্রীন, আমতলী, সদর, বাজারহাট} = 5
    expect(countUniqueMarkets([sornoMachiChal, alu, peyaj])).toBe(5);
    expect(countUniqueMarkets([])).toBe(0);
  });
});

describe("numeric sorting is Bengali-safe", () => {
  it("sorts using parsed numeric values, not formatted strings", () => {
    // The trap: lexicographic Bengali-digit string sort would order "৩০" after "১,৮৫০".
    const formatted = [sornoMachiChal, alu, kacchaMoric].map((p) => ({ p, label: String(p.today) }));
    const byNumeric = [...formatted].sort((a, b) => toNumericPrice(a.label) - toNumericPrice(b.label));
    expect(byNumeric.map((x) => x.p.nameBn)).toEqual(["আলু", "কাঁচামরিচ", "স্বর্ণমাছি চাল"]);
  });
});
