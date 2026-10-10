/**
 * Resilient API client for the BazarDor backend.
 *
 * Failover policy (see docs/adr/0001-api-failover-policy.md):
 *   - Every request is sent to PRIMARY_BASE_URL first.
 *   - The request is retried against FALLBACK_BASE_URL when the primary fails with:
 *       * network errors (DNS, TLS, connection refused/reset),
 *       * timeouts (per-attempt, see DEFAULT_TIMEOUT_MS),
 *       * malformed/unusable response bodies (invalid JSON, wrong shape),
 *       * any non-OK HTTP status OUTSIDE the 4xx range (all 5xx included).
 *   - Ordinary 4xx responses (validation errors, 404 not-found) are FINAL:
 *     the primary answered authoritatively, so the fallback is NOT tried.
 *   - Caller cancellation (opts.signal) propagates as-is and is never retried.
 *
 * Every attempt has an explicit timeout; bodies are parsed defensively;
 * all failures surface as a typed `ApiError` with a stable `kind`, the list
 * of URLs tried, and a Bangla user-facing message via getApiErrorMessage().
 *
 * This module is environment-agnostic (no React/Next imports): it works in
 * server components, route handlers, client components and plain Node tests.
 */

import type { ApiErrorBody } from "@/lib/types";

/**
 * Primary API host — tried first for every request.
 * Overridable with NEXT_PUBLIC_API_BASE_URL (see .env.example).
 */
export const PRIMARY_BASE_URL: string =
  (typeof process.env.NEXT_PUBLIC_API_BASE_URL === "string" &&
    process.env.NEXT_PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "")) ||
  "https://api.api-store.workers.dev/api/bazardor";

/**
 * Fallback API host — tried when the primary fails retryably (see policy above).
 * Overridable with NEXT_PUBLIC_API_FALLBACK_BASE_URL (see .env.example).
 */
export const FALLBACK_BASE_URL: string =
  (typeof process.env.NEXT_PUBLIC_API_FALLBACK_BASE_URL === "string" &&
    process.env.NEXT_PUBLIC_API_FALLBACK_BASE_URL.trim().replace(/\/+$/, "")) ||
  "https://api.abcz.workers.dev/api/bazardor";

const envTimeoutMs = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS);
/** Per-attempt request timeout in milliseconds (default 8000). */
export const DEFAULT_TIMEOUT_MS: number =
  Number.isFinite(envTimeoutMs) && envTimeoutMs > 0 ? envTimeoutMs : 8000;

/** Stable failure categories for programmatic handling and UI messaging. */
export type ApiErrorKind =
  /** Request exceeded the per-attempt timeout. */
  | "timeout"
  /** Connection-level failure (DNS, TLS, refused, reset). */
  | "network"
  /** Non-OK HTTP status that is not 404 (e.g. 400 validation, 5xx). */
  | "http"
  /** HTTP 404 — resource does not exist on the authoritative host. */
  | "notFound"
  /** Response body was not valid JSON or did not match the contract. */
  | "parse";

export interface ApiErrorInit {
  kind: ApiErrorKind;
  message: string;
  url?: string;
  retryable: boolean;
  status?: number;
  cause?: unknown;
}

/** Error thrown by every requestJson attempt once all candidates are exhausted. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly url: string;
  readonly status?: number;
  /** Whether requestJson may still try the fallback base URL after this error. */
  readonly retryable: boolean;
  /** Every base URL attempted for this request, in order (filled by requestJson). */
  triedUrls: string[];

  constructor(init: ApiErrorInit) {
    super(init.message, init.cause !== undefined ? { cause: init.cause } : undefined);
    this.name = "ApiError";
    this.kind = init.kind;
    this.url = init.url ?? "";
    this.status = init.status;
    this.retryable = init.retryable;
    this.triedUrls = init.url ? [init.url] : [];
  }
}

export interface ApiRequestOptions {
  /** Caller cancellation signal; aborts are never retried. */
  signal?: AbortSignal;
  /** Per-attempt timeout in ms; defaults to NEXT_PUBLIC_API_TIMEOUT_MS or 8000. */
  timeoutMs?: number;
  /** Fetch cache mode; defaults to "no-store" so daily prices stay fresh. */
  cache?: RequestCache;
  /**
   * Next.js ISR hint forwarded as `next.revalidate` (server-side only).
   * When set, prefer cache: "force-cache" semantics for that request.
   */
  revalidate?: number;
  /**
   * Optional runtime validator run on the parsed body of EVERY attempt.
   * A failing validator produces a retryable "parse" ApiError, so a host that
   * returns a well-formed body that breaks the contract (e.g. `{products: []}`
   * instead of `[]`) triggers the fallback exactly like malformed JSON does.
   */
  validate?: (data: unknown) => boolean;
  /** Human name of the expected shape, used in validation error messages. */
  expected?: string;
}

/** Base URLs in failover order, de-duplicated so a misconfiguration cannot double-fetch. */
function getBaseUrlCandidates(): string[] {
  return Array.from(new Set([PRIMARY_BASE_URL, FALLBACK_BASE_URL].filter((b) => b.length > 0)));
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function isAbortLike(error: unknown): boolean {
  const name = (error as { name?: unknown } | null | undefined)?.name;
  return name === "AbortError" || name === "TimeoutError";
}

function toApiError(error: unknown, url: string, timeoutMs: number): ApiError {
  if (error instanceof ApiError) return error;
  if (isAbortLike(error)) {
    return new ApiError({
      kind: "timeout",
      url,
      retryable: true,
      cause: error,
      message: `Request to ${url} timed out after ${timeoutMs}ms`,
    });
  }
  const detail = error instanceof Error ? error.message : String(error);
  return new ApiError({
    kind: "network",
    url,
    retryable: true,
    cause: error,
    message: `Network error while requesting ${url}: ${detail}`,
  });
}

function describeErrorBody(bodyText: string): string {
  const trimmed = bodyText.trim();
  if (!trimmed) return "";
  try {
    const parsed = JSON.parse(trimmed) as Partial<ApiErrorBody>;
    if (parsed && typeof parsed.error === "string" && parsed.error.trim()) {
      return parsed.error.trim();
    }
  } catch {
    // Not JSON — fall through to a raw snippet.
  }
  return trimmed.replace(/\s+/g, " ").slice(0, 120);
}

/** Convert a non-OK Response into an ApiError, honoring the retryability policy. */
async function httpApiError(response: Response, url: string): Promise<ApiError> {
  const { status, statusText } = response;
  const bodyText = await response.text().catch(() => "");
  const detail = describeErrorBody(bodyText);
  const kind: ApiErrorKind = status === 404 ? "notFound" : "http";
  // 4xx = authoritative answer from this host: do NOT fall back.
  // Everything else non-OK (3xx edge cases, 5xx, 0) may be a host problem: fall back.
  const retryable = !(status >= 400 && status < 500);
  return new ApiError({
    kind,
    url,
    status,
    retryable,
    message: `HTTP ${status}${statusText ? ` ${statusText}` : ""} from ${url}${detail ? ` — ${detail}` : ""}`,
  });
}

function snippet(text: string): string {
  return JSON.stringify(text.replace(/\s+/g, " ").trim().slice(0, 120));
}

/** Parse a response body as JSON; malformed bodies raise a retryable parse error. */
async function parseJsonBody<T>(response: Response, url: string): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (cause) {
    throw new ApiError({
      kind: "parse",
      url,
      retryable: true,
      cause,
      message: `Malformed JSON from ${url}: ${snippet(text)}`,
    });
  }
}

type FetchInit = RequestInit & { next?: { revalidate?: number } };

/**
 * Combine abort signals (caller + per-attempt timeout) into one signal.
 * Manual implementation instead of AbortSignal.any for wider browser support;
 * the first abort wins and its reason is forwarded.
 */
function combineSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
}

async function fetchOnce(
  url: string,
  options: Required<Pick<ApiRequestOptions, "cache">> & ApiRequestOptions,
  timeoutMs: number,
): Promise<Response> {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signals = options.signal ? [timeoutSignal, options.signal] : [timeoutSignal];
  const init: FetchInit = {
    method: "GET",
    headers: { accept: "application/json" },
    cache: options.cache,
    signal: combineSignals(signals),
  };
  if (options.revalidate !== undefined) {
    init.next = { revalidate: options.revalidate };
  }
  return fetch(url, init);
}

/**
 * GET `path` against the API with primary-then-fallback failover.
 *
 * @param path API path, e.g. "/products" or "/products?category=chal".
 * @returns Parsed JSON typed as T; when `options.validate` is provided the body
 *          is checked on every attempt and a mismatch is retryable (fallback).
 * @throws ApiError when every candidate fails or the failure is final (4xx).
 */
export async function requestJson<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const timeoutMs =
    options.timeoutMs !== undefined && options.timeoutMs > 0 ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
  const resolved = { ...options, cache: options.cache ?? ("no-store" as RequestCache) };
  const bases = getBaseUrlCandidates();
  const triedUrls: string[] = [];
  let lastError: ApiError | undefined;

  for (const base of bases) {
    const url = `${base}${normalizePath(path)}`;
    triedUrls.push(url);
    try {
      const response = await fetchOnce(url, resolved, timeoutMs);
      if (!response.ok) throw await httpApiError(response, url);
      const data = await parseJsonBody<T>(response, url);
      if (options.validate && !options.validate(data)) {
        throw new ApiError({
          kind: "parse",
          url,
          retryable: true,
          message: `Unexpected response shape from ${url}: expected ${options.expected ?? "a different shape"}.`,
        });
      }
      return data;
    } catch (error) {
      // Caller cancelled on purpose: propagate untouched, never fall back.
      if (options.signal?.aborted) throw error;
      const apiError = toApiError(error, url, timeoutMs);
      if (!apiError.retryable) {
        apiError.triedUrls = triedUrls;
        throw apiError;
      }
      lastError = apiError;
    }
  }

  if (!lastError) {
    throw new ApiError({
      kind: "network",
      retryable: false,
      message: "No API base URLs are configured.",
    });
  }
  lastError.triedUrls = triedUrls;
  throw lastError;
}

/**
 * Bangla, user-facing message for any error surfaced to the UI.
 * Keeps presentation strings in one place so pages never leak raw errors.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case "timeout":
        return "সার্ভার সময়মতো সাড়া দিচ্ছে না। একটু পরে আবার চেষ্টা করুন।";
      case "network":
        return "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
      case "notFound":
        return "অনুরোধ করা তথ্যটি পাওয়া যায়নি।";
      case "parse":
        return "সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।";
      case "http":
        if (error.status !== undefined && error.status >= 500) {
          return "সার্ভারে সাময়িক সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।";
        }
        return "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
    }
  }
  return "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।";
}
