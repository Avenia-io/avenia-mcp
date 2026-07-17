import { describe, it, expect } from "vitest";
import { DOCS_TOOLS, DOCS_TOOL_BY_NAME } from "./docsTools.js";
import { TOOLS } from "./tools.js";
import { GUIDES } from "./guides.js";

function textOf(result: { content: Array<{ type: string; text?: string }> }): string {
  return result.content[0]?.text ?? "";
}

describe("docs tools", () => {
  it("exposes the six documentation tools with titles", () => {
    expect(DOCS_TOOLS.map((t) => t.name)).toEqual([
      "avenia_list_guides",
      "avenia_read_guide",
      "avenia_list_flows",
      "avenia_get_flow",
      "avenia_list_endpoints",
      "avenia_describe_endpoint",
    ]);
    for (const t of DOCS_TOOLS) expect(t.title.length).toBeGreaterThan(0);
  });

  it("lists every guide and every endpoint", async () => {
    const guides = JSON.parse(textOf(await DOCS_TOOL_BY_NAME.get("avenia_list_guides")!.handler({})));
    expect(guides.length).toBe(GUIDES.length);

    const endpoints = JSON.parse(
      textOf(await DOCS_TOOL_BY_NAME.get("avenia_list_endpoints")!.handler({}))
    );
    expect(endpoints.length).toBe(TOOLS.length);
    expect(endpoints[0]).toHaveProperty("method");
    expect(endpoints[0]).toHaveProperty("path");
  });

  it("describes a known endpoint with its request schema, and rejects unknown names", async () => {
    const describe_ = DOCS_TOOL_BY_NAME.get("avenia_describe_endpoint")!;
    const spec = JSON.parse(textOf(await describe_.handler({ name: TOOLS[0].name })));
    expect(spec.name).toBe(TOOLS[0].name);
    expect(spec.requestSchema).toBeDefined();
    expect(spec.baseUrls.sandbox).toContain("sandbox");

    const bad = await describe_.handler({ name: "nope" });
    expect(bad.isError).toBe(true);
  });
});
