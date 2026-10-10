/**
 * Bengali (Bangla) numeral & price formatting utilities.
 *
 * All user-facing numbers in BazarDor render in Bengali numerals
 * (e.g. "১৪৮ টাকা", "▲ ২.১%") while the data layer stays numeric.
 * These helpers are the single source of truth for that conversion,
 * so sorting/filtering must use the numeric values (see toNumericPrice).
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;
const EN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

/** Replace every ASCII digit with its Bengali counterpart. */
export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Replace every Bengali digit with its ASCII counterpart (inverse of toBengaliDigits). */
export function toEnglishDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => EN_DIGITS[BN_DIGITS.indexOf(d as (typeof BN_DIGITS)[number])]);
}

/**
 * Parse a numeric price out of either ASCII or Bengali-digit text.
 * Accepts thousands separators (both "1,850" and "১,৮৫০"), decimals,
 * leading/trailing whitespace. Returns NaN when nothing numeric remains.
 */
export function toNumericPrice(input: string | number): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : NaN;
  const normalized = toEnglishDigits(input)
    .replace(/[,\u09F3\u0024\u20B9]/g, "") // strip separators & currency symbols (৳ $ ₹)
    .replace(/[^\d.\-]/g, "");
  if (normalized === "" || normalized === "-" || normalized === "." || normalized === "-.") return NaN;
  return Number(normalized);
}

/**
 * Format an integer price in Bengali digits with thousand separators.
 * 148 -> "১৪৮", 1850 -> "১,৮৫০"
 */
export function formatBnPrice(value: number): string {
  const n = toNumericPrice(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 }).format(n);
}

/**
 * Format a decimal value (e.g. an average of market prices) with the given
 * fraction digits, in Bengali digits. 68.5, 2 -> "৬৮.৫০"
 */
export function formatBnDecimal(value: number, fractionDigits = 2): string {
  const n = toNumericPrice(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

/** Full price label, e.g. "১৪৮ টাকা". */
export function formatBnTaka(value: number): string {
  return `${formatBnPrice(value)} টাকা`;
}

/** Percentage label in Bengali digits, magnitude only, e.g. "২.১%". */
export function formatBnPercent(value: number): string {
  const n = toNumericPrice(value);
  if (Number.isNaN(n)) return "—";
  return `${new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(n))}%`;
}

/**
 * Change badge text, e.g. "▲ ২.১%", "▼ ২.৯%", "— ০.০%".
 * `flat` renders with an em-dash per the design and is treated as neutral,
 * from an explicit dir or a pct of exactly 0.
 */
export function formatBnChange(dir: "up" | "down" | "flat", pct: number): string {
  const pctLabel = formatBnPercent(pct);
  if (dir === "up") return `▲ ${pctLabel}`;
  if (dir === "down") return `▼ ${pctLabel}`;
  return `— ${pctLabel}`;
}

/** Tailwind-friendly tone for a change direction; contracts live in one place. */
export function changeTone(dir: "up" | "down" | "flat"): "up" | "down" | "flat" {
  return dir;
}

/** Bangla date in the design format, e.g. "শনিবার, ১০ অক্টোবর, ২০২৬". */
export function formatBnDate(date: Date = new Date()): string {
  return date.toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
