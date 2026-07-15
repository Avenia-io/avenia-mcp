import { describe, it, expect } from "vitest";
import { TOOLS } from "./tools.js";

describe("TOOLS registry", () => {
  it("exposes a non-empty curated tool surface", () => {
    expect(TOOLS.length).toBeGreaterThan(0);
  });

  it("has unique, well-formed names", () => {
    const seen = new Set<string>();
    for (const t of TOOLS) {
      expect(t.name, `bad tool name: ${t.name}`).toMatch(/^avenia_[a-z0-9_]+$/);
      expect(seen.has(t.name), `duplicate tool name: ${t.name}`).toBe(false);
      seen.add(t.name);
    }
  });

  it("declares every path param as a placeholder in its template", () => {
    for (const t of TOOLS) {
      for (const p of t.pathParams) {
        expect(
          t.pathTemplate.includes(`{${p}}`),
          `${t.name}: path param "${p}" missing from template "${t.pathTemplate}"`
        ).toBe(true);
      }
    }
  });

  it("uses valid HTTP methods and object input schemas", () => {
    const methods = new Set(["GET", "POST", "PATCH", "PUT", "DELETE"]);
    for (const t of TOOLS) {
      expect(methods.has(t.method), `${t.name}: bad method ${t.method}`).toBe(true);
      expect(typeof t.bodyUnwrap, `${t.name}: bodyUnwrap`).toBe("boolean");
      const schema = t.inputSchema as { type?: unknown };
      expect(schema.type, `${t.name}: inputSchema.type`).toBe("object");
    }
  });

  it("only avenia_get_public_key is callable without credentials", () => {
    const noAuth = TOOLS.filter((t) => t.skipAuth).map((t) => t.name);
    expect(noAuth).toEqual(["avenia_get_public_key"]);
  });
});
