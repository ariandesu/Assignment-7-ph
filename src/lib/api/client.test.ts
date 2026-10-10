import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  DEFAULT_TIMEOUT_MS,
  FALLBACK_BASE_URL,
  PRIMARY_BASE_URL,
  getApiErrorMessage,
  requestJson,
} from "@/lib/api/client";

const PRIMARY = `${PRIMARY_BASE_URL}/products`;
const FALLBACK = `${FALLBACK_BASE_URL}/products`;

function jsonResponse(body: unknown, status = 200, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function okProducts(products: unknown = [{ id: 1 }]): Response {
  return jsonResponse(products, 200);
}

/**
 * Abort-aware fetch stand-in: mirrors real fetch, which rejects with an
 * AbortError when `init.signal` fires. A "never resolves" handler therefore
 * behaves like a hung server that the timeout can actually cancel.
 */
function abortablePending(init: RequestInit | undefined): Promise<Response> {
  return new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal;
    if (!signal) return; // deliberately never settles
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener(
      "abort",
      () => reject(signal.reason ?? new DOMException("Aborted", "AbortError")),
      { once: true },
    );
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

/**
 * URL-routing fetch mock: handlers are matched by full URL. A handler returning
 * "pending" gives a request that never settles until aborted. Any URL without a
 * handler throws a TypeError, mimicking a real network failure.
 */
function mockFetchRoutes(handlers: Record<string, (() => Promise<Response>) | "pending">): void {
  fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    // Faithful to real fetch: an already-aborted signal rejects immediately.
    if (init?.signal?.aborted) {
      throw init.signal.reason ?? new DOMException("Aborted", "AbortError");
    }
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const handler = handlers[url];
    if (!handler) throw new TypeError(`fetch failed for ${url}`);
    if (handler === "pending") return abortablePending(init);
    return handler();
  });
}

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("requestJson — primary success", () => {
  it("returns primary data and never touches the fallback", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => okProducts([{ id: 1 }, { id: 2 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products");

    expect(data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(PRIMARY);
  });

  it("marks the request as no-store by default", async () => {
    mockFetchRoutes({ [PRIMARY]: async () => okProducts() });
    await requestJson("/products");
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.cache).toBe("no-store");
    expect((init.headers as Record<string, string>).accept).toBe("application/json");
  });
});

describe("requestJson — fallback triggers", () => {
  it("falls back on a network error from the primary", async () => {
    mockFetchRoutes({
      [FALLBACK]: async () => okProducts([{ id: 9 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products");

    expect(data).toEqual([{ id: 9 }]);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(PRIMARY);
    expect(String(fetchMock.mock.calls[1]?.[0])).toBe(FALLBACK);
  });

  it("falls back on a 5xx response from the primary", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => jsonResponse({ error: "boom" }, 500),
      [FALLBACK]: async () => okProducts([{ id: 7 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products");

    expect(data).toEqual([{ id: 7 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back on a 503 response from the primary", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => jsonResponse({ error: "unavailable" }, 503),
      [FALLBACK]: async () => okProducts([{ id: 8 }]),
    });

    await expect(requestJson("/products")).resolves.toEqual([{ id: 8 }]);
  });

  it("falls back on a timeout of the primary", async () => {
    mockFetchRoutes({
      [PRIMARY]: "pending",
      [FALLBACK]: async () => okProducts([{ id: 5 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products", { timeoutMs: 50 });

    expect(data).toEqual([{ id: 5 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back on a malformed JSON body from the primary", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => new Response("<html>gateway error</html>", { status: 200 }),
      [FALLBACK]: async () => okProducts([{ id: 4 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products");

    expect(data).toEqual([{ id: 4 }]);
  });

  it("falls back when a 200 body breaks the validator, then accepts a valid fallback body", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => okProducts({ products: [] }), // wrong shape
      [FALLBACK]: async () => okProducts([{ id: 6 }]),
    });

    const data = await requestJson<Array<{ id: number }>>("/products", {
      validate: (body) => Array.isArray(body),
      expected: "array",
    });

    expect(data).toEqual([{ id: 6 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("requestJson — no fallback on 4xx", () => {
  it("does NOT fall back on 404 and reports notFound", async () => {
    const primary404 = `${PRIMARY_BASE_URL}/products/9999`;
    mockFetchRoutes({
      [primary404]: async () => jsonResponse({ error: "Not found" }, 404),
      [`${FALLBACK_BASE_URL}/products/9999`]: async () => okProducts(),
    });

    const error = await requestJson("/products/9999").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as ApiError;
    expect(apiError.kind).toBe("notFound");
    expect(apiError.status).toBe(404);
    expect(apiError.retryable).toBe(false);
    expect(apiError.triedUrls).toEqual([primary404]);
    expect(fetchMock).toHaveBeenCalledTimes(1); // fallback never attempted
  });

  it("does NOT fall back on 400 validation errors and reports http", async () => {
    const primary400 = `${PRIMARY_BASE_URL}/products?category=bad%20slug`;
    mockFetchRoutes({
      [primary400]: async () => jsonResponse({ error: "invalid category" }, 400),
      [`${FALLBACK_BASE_URL}/products?category=bad%20slug`]: async () => okProducts(),
    });

    const error = (await requestJson("/products?category=bad%20slug").catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("http");
    expect(error.status).toBe(400);
    expect(error.retryable).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT fall back on 422 and keeps the message useful", async () => {
    mockFetchRoutes({
      [`${PRIMARY_BASE_URL}/products/42`]: async () => jsonResponse({ error: "unprocessable" }, 422),
    });

    const error = (await requestJson("/products/42").catch((e: unknown) => e)) as ApiError;

    expect(error.kind).toBe("http");
    expect(error.status).toBe(422);
    expect(error.message).toContain("HTTP 422");
    expect(error.message).toContain("unprocessable");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("requestJson — both hosts failing", () => {
  it("reports every attempted URL when both fail with 5xx", async () => {
    mockFetchRoutes({
      [PRIMARY]: async () => jsonResponse({ error: "primary down" }, 500),
      [FALLBACK]: async () => jsonResponse({ error: "fallback down" }, 502),
    });

    const error = (await requestJson("/products").catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("http");
    expect(error.status).toBe(502);
    expect(error.triedUrls).toEqual([PRIMARY, FALLBACK]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reports a network error when both hosts are unreachable", async () => {
    mockFetchRoutes({});

    const error = (await requestJson("/categories").catch((e: unknown) => e)) as ApiError;

    expect(error.kind).toBe("network");
    expect(error.retryable).toBe(true);
    expect(error.triedUrls).toEqual([`${PRIMARY_BASE_URL}/categories`, `${FALLBACK_BASE_URL}/categories`]);
  });
});

describe("requestJson — caller cancellation", () => {
  it("propagates abort without trying the fallback", async () => {
    const controller = new AbortController();
    // Abort with a DOMException like a real caller-side cancellation.
    controller.abort(new DOMException("Aborted", "AbortError"));

    mockFetchRoutes({
      [PRIMARY]: async () => okProducts(),
      [FALLBACK]: async () => okProducts(),
    });

    const error = (await requestJson("/products", { signal: controller.signal }).catch((e: unknown) => e)) as Error;

    // The rejection is the caller's own abort reason, propagated untouched.
    expect((error as DOMException).name).toBe("AbortError");
    expect(fetchMock).toHaveBeenCalledTimes(1); // attempted once, then aborted — no fallback loop
  });
});

describe("ApiError & messages", () => {
  it("exposes a stable message set for the UI", () => {
    const cases: Array<[ApiError, string]> = [
      [new ApiError({ kind: "timeout", retryable: true, message: "x" }), "সার্ভার সময়মতো সাড়া দিচ্ছে না। একটু পরে আবার চেষ্টা করুন।"],
      [new ApiError({ kind: "network", retryable: true, message: "x" }), "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"],
      [new ApiError({ kind: "notFound", retryable: false, message: "x" }), "অনুরোধ করা তথ্যটি পাওয়া যায়নি।"],
      [new ApiError({ kind: "parse", retryable: true, message: "x" }), "সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।"],
      [new ApiError({ kind: "http", retryable: false, status: 503, message: "x" }), "সার্ভারে সাময়িক সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।"],
      [new ApiError({ kind: "http", retryable: false, status: 400, message: "x" }), "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"],
    ];
    for (const [error, expected] of cases) {
      expect(getApiErrorMessage(error)).toBe(expected);
    }
    expect(getApiErrorMessage(new TypeError("nope"))).toBe("কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।");
  });

  it("has an 8s default timeout and supports overrides", async () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(8000);
    mockFetchRoutes({
      [PRIMARY]: "pending",
      [FALLBACK]: "pending",
    });
    const started = Date.now();
    const error = (await requestJson("/products", { timeoutMs: 40 }).catch((e: unknown) => e)) as ApiError;
    expect(error.kind).toBe("timeout");
    expect(Date.now() - started).toBeLessThan(2000);
  });
});
