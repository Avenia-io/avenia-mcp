import { describe, it, expect } from "vitest";
import { GUIDES } from "./guides.js";
import { listGuideResources, resolveGuideUri, GUIDE_URI_PREFIX } from "./resources.js";

describe("guide resources", () => {
  it("lists exactly one resource per guide with well-formed descriptors", () => {
    const res = listGuideResources();
    expect(res.length).toBe(GUIDES.length);
    for (const r of res) {
      expect(r.uri.startsWith(GUIDE_URI_PREFIX)).toBe(true);
      expect(r.name.length).toBeGreaterThan(0);
      expect(r.mimeType).toBe("text/markdown");
    }
  });

  it("resolves a known guide URI and rejects unknown or foreign URIs", () => {
    const first = GUIDES[0];
    expect(resolveGuideUri(`${GUIDE_URI_PREFIX}${first.id}`)?.id).toBe(first.id);
    expect(resolveGuideUri(`${GUIDE_URI_PREFIX}__does_not_exist__`)).toBeUndefined();
    expect(resolveGuideUri("https://example.com/not-a-guide")).toBeUndefined();
  });
});
