import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GUIDES, GUIDE_BY_ID } from "./guides.js";
import { readGuide } from "./resources.js";
import { PROMPTS, PROMPT_BY_NAME, renderPromptBody, guideResourceLinks } from "./prompts.js";
import { TOOLS } from "./tools.js";

/**
 * Read-only "docs" tools. The guides and flows are also exposed as MCP resources
 * and prompts, but tool-centric clients (e.g. claude.ai connectors) don't surface
 * those — so we expose the same content as tools too. All are safe on the public
 * read-only endpoint (no credentials, no side effects).
 */
export interface DocsTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<CallToolResult> | CallToolResult;
}

function ok(data: unknown): CallToolResult {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return { content: [{ type: "text", text }] };
}
function fail(message: string): CallToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export const DOCS_TOOLS: DocsTool[] = [
  {
    name: "avenia_list_guides",
    title: "List Avenia integration guides",
    description:
      "List every Avenia integration-guide doc (id, title, category, summary). Then call avenia_read_guide with an id to read the full guide.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: () =>
      ok(
        GUIDES.map((g) => ({ id: g.id, title: g.title, category: g.category, summary: g.summary }))
      ),
  },
  {
    name: "avenia_read_guide",
    title: "Read an Avenia integration guide",
    description:
      "Read the full markdown of one Avenia integration guide, by id (from avenia_list_guides). Prefer this over web search for Avenia docs.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Guide id, e.g. \"security-api-keys-management\" (from avenia_list_guides)." },
      },
      required: ["id"],
      additionalProperties: false,
    },
    handler: async (args) => {
      const id = String(args.id ?? "").trim();
      const guide = GUIDE_BY_ID.get(id);
      if (!guide) return fail(`Unknown guide id "${id}". Call avenia_list_guides for valid ids.`);
      try {
        return ok(await readGuide(guide));
      } catch (err) {
        return fail(`Failed to read guide "${id}": ${err instanceof Error ? err.message : String(err)}`);
      }
    },
  },
  {
    name: "avenia_list_flows",
    title: "List Avenia integration flows",
    description:
      "List the ready-made Avenia integration flows (name, description, arguments). Then call avenia_get_flow with a name for its step-by-step.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: () =>
      ok(PROMPTS.map((p) => ({ name: p.name, description: p.description, arguments: p.arguments }))),
  },
  {
    name: "avenia_get_flow",
    title: "Get an Avenia integration flow",
    description:
      "Get the step-by-step walkthrough for one Avenia flow by name (from avenia_list_flows). Pass the flow's arguments to fill the template.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Flow name, e.g. \"avenia_flow_pix_to_stablecoin_onchain\"." },
      },
      required: ["name"],
      additionalProperties: true,
    },
    handler: (args) => {
      const name = String(args.name ?? "").trim();
      const prompt = PROMPT_BY_NAME.get(name);
      if (!prompt) return fail(`Unknown flow "${name}". Call avenia_list_flows for valid names.`);
      const body = renderPromptBody(prompt.template, args as Record<string, string | undefined>);
      const links = guideResourceLinks(prompt.guideIds);
      const linksBlock =
        links.length > 0
          ? `\n\nReference guides (read with avenia_read_guide):\n` +
            links.map((l) => `- ${l.uri.replace("avenia-guide://", "")} — ${l.name}`).join("\n")
          : "";
      return ok(body + linksBlock);
    },
  },
];

const API_TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

// Endpoint-catalog tools: expose the API surface as *specs* (method, path,
// params, request schema) so agents can discover services and generate accurate
// integration code — without executing anything. Execution stays behind the
// locally-installed server with the user's own API key.
DOCS_TOOLS.push(
  {
    name: "avenia_list_endpoints",
    title: "List Avenia API endpoints",
    description:
      "List every Avenia public API endpoint (name, HTTP method, path, summary, whether it needs credentials). Then call avenia_describe_endpoint with a name for its full request spec. Read-only — nothing is executed.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: () =>
      ok(
        TOOLS.map((t) => ({
          name: t.name,
          method: t.method,
          path: t.pathTemplate,
          summary: t.description,
          authRequired: !t.skipAuth,
        }))
      ),
  },
  {
    name: "avenia_describe_endpoint",
    title: "Describe an Avenia API endpoint",
    description:
      "Get the spec of one Avenia endpoint by name (from avenia_list_endpoints): HTTP method, path, path/query parameters and the JSON request schema — enough to generate correct integration code. Read-only, does NOT call the API. For response shapes and error codes, read the matching guide (avenia_read_guide) or api-reference.avenia.io.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: 'Endpoint/tool name, e.g. "avenia_get_fixed_rate_quote" (from avenia_list_endpoints).',
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    handler: (args) => {
      const name = String(args.name ?? "").trim();
      const t = API_TOOL_BY_NAME.get(name);
      if (!t) return fail(`Unknown endpoint "${name}". Call avenia_list_endpoints for valid names.`);
      return ok({
        name: t.name,
        summary: t.description,
        method: t.method,
        path: t.pathTemplate,
        pathParams: t.pathParams,
        queryParams: t.queryParams,
        authRequired: !t.skipAuth,
        auth: t.skipAuth ? "none" : "X-API-Key header (or Authorization: Bearer)",
        baseUrls: {
          sandbox: "https://api.sandbox.avenia.io:10952/v2",
          production: "https://api.avenia.io:8443/v2",
        },
        requestSchema: t.inputSchema,
        note:
          "Schema shown is the tool input: path/query params plus `body` (the JSON request body) where applicable. " +
          "Response shapes & error codes: see api-reference.avenia.io or the guides.",
      });
    },
  }
);

export const DOCS_TOOL_BY_NAME = new Map<string, DocsTool>(DOCS_TOOLS.map((t) => [t.name, t]));
