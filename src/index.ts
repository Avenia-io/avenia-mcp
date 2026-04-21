import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

import { apiRequest, type HttpMethod } from "./client.js";
import { config, logger } from "./config.js";
import { AveniaApiError, MissingCredentialError } from "./errors.js";
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
  // Touch config early — catches malformed AVENIA_ENV at boot.
  const cfg = config();
  const log = logger();

  const server = new Server(
    { name: PKG_NAME, version: PKG_VERSION },
    { capabilities: { tools: {} } }
  );

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

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log.info(
    `started ${PKG_NAME}@${PKG_VERSION} env=${cfg.env} base=${cfg.baseURL} tools=${TOOLS.length}` +
      (cfg.apiKey ? " auth=api-key" : cfg.bearerToken ? " auth=bearer" : " auth=NONE")
  );
}

main().catch((err) => {
  process.stderr.write(`[avenia-mcp:fatal] ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  process.exit(1);
});
