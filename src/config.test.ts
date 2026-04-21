import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    for (const k of Object.keys(process.env)) if (k.startsWith("AVENIA_")) delete process.env[k];
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("defaults to sandbox", () => {
    const cfg = loadConfig();
    expect(cfg.env).toBe("sandbox");
    expect(cfg.baseURL).toBe("https://api.sandbox.avenia.io:10952/v2");
    expect(cfg.timeoutMs).toBe(60_000);
    expect(cfg.logLevel).toBe("info");
  });

  it("resolves production", () => {
    process.env.AVENIA_ENV = "production";
    expect(loadConfig().baseURL).toBe("https://api.avenia.io:8443/v2");
  });

  it("honors AVENIA_API_BASE_URL override", () => {
    process.env.AVENIA_API_BASE_URL = "https://example.com/v2/";
    const cfg = loadConfig();
    expect(cfg.baseURL).toBe("https://example.com/v2");
    expect(cfg.env).toBe("custom");
  });

  it("rejects unknown AVENIA_ENV without explicit base", () => {
    process.env.AVENIA_ENV = "staging";
    expect(() => loadConfig()).toThrow(/AVENIA_ENV/);
  });

  it("reads credentials", () => {
    process.env.AVENIA_API_KEY = "k";
    process.env.AVENIA_BEARER_TOKEN = "t";
    const cfg = loadConfig();
    expect(cfg.apiKey).toBe("k");
    expect(cfg.bearerToken).toBe("t");
  });
});
