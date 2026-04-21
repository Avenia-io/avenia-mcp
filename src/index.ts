import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

import { apiRequest, type HttpMethod } from "./client.js";
import { config, logger } from "./config.js";
import { AveniaApiError, MissingCredentialError } from "./errors.js";
import {
  listGuideResources,
  readGuide,
  resolveGuideUri,
} from "./resources.js";
import {
  PROMPTS,
  PROMPT_BY_NAME,
  guideResourceLinks,
  renderPromptBody,
} from "./prompts.js";
import { TOOLS, type ToolDefinition } from "./tools.js";

const PKG_NAME = "avenia-mcp";
const PKG_VERSION = "0.1.0";

const TOOL_BY_NAME = new Map<string, ToolDefinition>(TOOLS.map((t) => [t.name, t]));

async function dispatch(tool: ToolDefinition, args: Record<string, unknown>): Promise<unknown> {
  let path = tool.pathTemplate;

  for (const p of tool.pathParams) {
    const v = args[p];
    if (v === undefined || v === null || v === "") {
      throw new Error(`Missing required path parameter "${p}" for ${tool.name}`);
    }
    path = path.replace(`{${p}}`, encodeURIComponent(String(v)));
  }

  const query: Record<string, string | number | boolean | undefined | null> = {};
  for (const q of tool.queryParams) {
    if (q in args) query[q] = args[q] as typeof query[string];
  }

  const body = tool.bodyUnwrap ? (args.body as unknown) : undefined;

  return apiRequest(tool.method as HttpMethod, path, {
    query,
    body,
    skipAuth: tool.skipAuth,
  });
}

function toResult(data: unknown, isError = false): CallToolResult {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return {
    content: [{ type: "text", text }],
    ...(isError ? { isError: true } : {}),
  };
}

function errorToResult(err: unknown): CallToolResult {
  if (err instanceof MissingCredentialError) {
    return toResult(err.message, true);
  }
  if (err instanceof AveniaApiError) {
    return toResult(
      {
        error: "avenia_api_error",
        status: err.status,
        method: err.method,
        path: err.path,
        body: err.body,
      },
      true
    );
  }
  const msg = err instanceof Error ? err.message : String(err);
  return toResult({ error: "tool_error", message: msg }, true);
}

async function main() {
  const cfg = config();
  const log = logger();

  const server = new Server(
    { name: PKG_NAME, version: PKG_VERSION },
    { capabilities: { tools: {}, resources: {}, prompts: {} } }
  );

  // ---- tools ----
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOL_BY_NAME.get(req.params.name);
    if (!tool) {
      return toResult({ error: "unknown_tool", name: req.params.name }, true);
    }
    try {
      const data = await dispatch(tool, (req.params.arguments ?? {}) as Record<string, unknown>);
      return toResult(data ?? { ok: true });
    } catch (err) {
      log.error(`tool ${tool.name} failed:`, err instanceof Error ? err.message : String(err));
      return errorToResult(err);
    }
  });

  // ---- resources (integration guides) ----
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: listGuideResources(),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;
    const guide = resolveGuideUri(uri);
    if (!guide) {
      throw new Error(`Unknown resource URI: ${uri}`);
    }
    try {
      const body = await readGuide(guide);
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: body,
          },
        ],
      };
    } catch (err) {
      log.error(`resource ${uri} fetch failed:`, err instanceof Error ? err.message : String(err));
      throw err;
    }
  });

  // ---- prompts (flow templates) ----
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: PROMPTS.map((p) => ({
      name: p.name,
      description: p.description,
      arguments: p.arguments.map((a) => ({
        name: a.name,
        description: a.description,
        required: a.required ?? false,
      })),
    })),
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (req) => {
    const prompt = PROMPT_BY_NAME.get(req.params.name);
    if (!prompt) {
      throw new Error(`Unknown prompt: ${req.params.name}`);
    }
    const args = (req.params.arguments ?? {}) as Record<string, string | undefined>;
    const body = renderPromptBody(prompt.template, args);
    const links = guideResourceLinks(prompt.guideIds);

    const linksBlock =
      links.length > 0
        ? `\n\nReference guides (resources you can read via resources/read):\n` +
          links.map((l) => `- \`${l.uri}\` — ${l.name} — ${l.description}`).join("\n")
        : "";

    return {
      description: prompt.description,
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: body + linksBlock },
        },
      ],
    };
  });

  // ---- transport ----
  const transport = new StdioServerTransport();
  await server.connect(transport);

  log.info(
    `started ${PKG_NAME}@${PKG_VERSION} env=${cfg.env} base=${cfg.baseURL} ` +
      `tools=${TOOLS.length} resources=${listGuideResources().length} prompts=${PROMPTS.length}` +
      (cfg.apiKey ? " auth=api-key" : cfg.bearerToken ? " auth=bearer" : " auth=NONE")
  );
}

main().catch((err) => {
  process.stderr.write(`[avenia-mcp:fatal] ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  process.exit(1);
});
