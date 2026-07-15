import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock undici's request so no real network call is made.
const requestMock = vi.fn();
vi.mock("undici", () => ({ request: (...args: unknown[]) => requestMock(...args) }));

function fakeResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    body: { text: async () => (typeof body === "string" ? body : JSON.stringify(body)) },
  };
}

describe("apiRequest", () => {
  beforeEach(() => {
    vi.resetModules(); // re-evaluate config() cache per test
    requestMock.mockReset();
    for (const k of Object.keys(process.env)) if (k.startsWith("AVENIA_")) delete process.env[k];
  });

  it("sends X-API-Key and builds the sandbox v2 URL", async () => {
    process.env.AVENIA_API_KEY = "sk_test";
    process.env.AVENIA_ENV = "sandbox";
    requestMock.mockResolvedValue(fakeResponse(200, { ok: true }));

    const { apiRequest } = await import("./client.js");
    const out = await apiRequest("GET", "/account/balances");

    expect(out).toEqual({ ok: true });
    const [url, opts] = requestMock.mock.calls[0] as [URL, { headers: Record<string, string> }];
    expect(String(url)).toBe("https://api.sandbox.avenia.io:10952/v2/account/balances");
    expect(opts.headers["X-API-Key"]).toBe("sk_test");
    expect(opts.headers["Authorization"]).toBeUndefined();
  });

  it("maps a 4xx response to AveniaApiError", async () => {
    process.env.AVENIA_API_KEY = "sk_test";
    requestMock.mockResolvedValue(fakeResponse(422, { message: "invalid" }));

    const { apiRequest } = await import("./client.js");
    const { AveniaApiError } = await import("./errors.js");
    await expect(apiRequest("POST", "/tickets")).rejects.toBeInstanceOf(AveniaApiError);
  });

  it("throws MissingCredentialError when no credential is configured", async () => {
    const { apiRequest } = await import("./client.js");
    const { MissingCredentialError } = await import("./errors.js");
    await expect(apiRequest("GET", "/account/balances")).rejects.toBeInstanceOf(
      MissingCredentialError
    );
    expect(requestMock).not.toHaveBeenCalled();
  });
});
