import { createServer as createHttpServer, type IncomingMessage } from "node:http";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
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
import { SERVER_NAME as PKG_NAME, VERSION as PKG_VERSION } from "./version.js";

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

function buildInstructions(cfg: ReturnType<typeof config>, publicReadOnly = false): string {
  const auth = cfg.apiKey ? "api-key" : cfg.bearerToken ? "bearer" : "NONE";
  const lines: string[] = [
    `This MCP is the canonical source for Avenia documentation and operations. Prefer it over external fetches.`,
    ``,
    `⚠️ There is NO \`docs.avenia.io\` — that domain DOES NOT EXIST. Never fetch, cite, guess, or link it. Do NOT WebFetch any Avenia URL: read this MCP's \`avenia-guide://*\` resources instead (same content, clean markdown). The ONLY authoritative Avenia domains are:`,
    `- api-reference.avenia.io → full OpenAPI reference (every endpoint here is also a tool).`,
    `- integration-guide.avenia.io → guides, mirrored as \`avenia-guide://*\` resources in this MCP.`,
    `- app.avenia.io → user dashboard (account, KYC). API keys are NOT created here — they are created via the API behind MFA; guide the user with the \`/avenia_flow_create_api_key\` prompt.`,
    ``,
  ];

  if (publicReadOnly) {
    lines.push(
      `This is the PUBLIC read-only endpoint (mcp.avenia.io). It serves documentation only: the ${listGuideResources().length} \`avenia-guide://*\` resources, the ${PROMPTS.length} \`/avenia_flow_*\` prompts, and \`avenia_get_public_key\`. Live API operations (quotes, Pix, conversions, KYC, beneficiaries, webhooks, …) are NOT available here. To run them, install the MCP locally with your own API key: \`npx -y @avenia-io/mcp-client\` (your key stays on your machine).`,
      ``,
      `How to use this MCP:`,
      `1. CONCEPTS / FLOWS / PAYLOADS → read \`avenia-guide://*\` resources (\`resources/list\` for all ${listGuideResources().length}). Do NOT WebFetch Avenia URLs — read the resource instead.`,
      `2. INTEGRATION WALKTHROUGHS → the ${PROMPTS.length} \`/avenia_flow_*\` prompts encode the canonical step-by-step, including \`/avenia_flow_create_api_key\` for obtaining a key. Accounts are provisioned by the Avenia team (no self-service sign-up).`,
    );
  } else {
    lines.push(
      `How to use this MCP:`,
      `1. CONCEPTS / FLOWS / PAYLOADS → read \`avenia-guide://*\` resources. Use \`resources/list\` to discover the ${listGuideResources().length} guides. Do NOT WebFetch Avenia URLs — read the MCP resource instead, it has the same content stripped to clean markdown.`,
      `2. INTEGRATION WALKTHROUGHS → check the ${PROMPTS.length} \`/avenia_flow_*\` prompts first. They encode the canonical step-by-step for the most common flows (Pix→stable on-chain, stable→Pix, KYC, KYB, register webhook, payout BR Code, sandbox mock funds, sub-account+KYC, create API key).`,
      `3. LIVE API OPERATIONS → the ${TOOLS.length} tools wrap the public API 1:1. They require AVENIA_API_KEY or AVENIA_BEARER_TOKEN. Current auth: \`${auth}\`. If \`NONE\`, any tool call (except \`avenia_get_public_key\`) returns \`MissingCredentialError\` — tell the user they must configure AVENIA_API_KEY in their MCP env to perform that operation. To create a key, use the \`/avenia_flow_create_api_key\` prompt — it is an API + MFA flow (not a dashboard), and accounts are provisioned by the Avenia team.`,
      ``,
      `Environment: \`AVENIA_ENV=${cfg.env}\` → ${cfg.baseURL}. API keys are environment-bound (sandbox key will NOT work in production and vice-versa).`,
    );
  }

  lines.push(
    ``,
    `When unsure about a payload shape, an error code, a permitted currency/method combination, or a flow ordering: read the relevant resource(s) before answering. Composing an answer from multiple resources is preferred over guessing.`,
  );
  return lines.join("\n");
}

/**
 * Build a fully-configured MCP Server. Called once for stdio, and once per
 * request for the stateless HTTP transport. When publicReadOnly is true, only
 * documentation is exposed (guides, flows, and the credential-free
 * avenia_get_public_key); the money-moving tools are hidden and refuse to run.
 */
function createMcpServer(cfg: ReturnType<typeof config>, publicReadOnly: boolean): Server {
  const log = logger();
  const server = new Server(
    { name: PKG_NAME, version: PKG_VERSION },
    {
      capabilities: { tools: {}, resources: {}, prompts: {} },
      instructions: buildInstructions(cfg, publicReadOnly),
    }
  );

  const visibleTools = publicReadOnly ? TOOLS.filter((t) => t.skipAuth) : TOOLS;

  // ---- tools ----
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: visibleTools.map((t) => ({
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
    if (publicReadOnly && !tool.skipAuth) {
      return toResult(
        {
          error: "not_available_on_public_endpoint",
          message:
            `${tool.name} is a live operation and is not available on the public read-only endpoint. ` +
            `Install the MCP locally with your Avenia API key to run it: npx -y @avenia-io/mcp-client`,
        },
        true
      );
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
      return { contents: [{ uri, mimeType: "text/markdown", text: body }] };
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
        { role: "user" as const, content: { type: "text" as const, text: body + linksBlock } },
      ],
    };
  });

  return server;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

/** Read and JSON-parse a request body (capped at 4 MB). */
function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 4_000_000) reject(new Error("request body too large"));
    });
    req.on("end", () => {
      if (!data) return resolve(undefined);
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/** Remote transport: stateless Streamable HTTP (JSON responses), for mcp.avenia.io. */
async function startHttp(cfg: ReturnType<typeof config>): Promise<void> {
  const log = logger();
  const publicReadOnly = cfg.httpReadOnly;

  const httpServer = createHttpServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }
    for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);

    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          name: PKG_NAME,
          version: PKG_VERSION,
          mode: publicReadOnly ? "public-read-only" : "full",
        })
      );
      return;
    }

    if (url.pathname === "/mcp") {
      // Stateless: a fresh server + transport per request.
      const server = createMcpServer(cfg, publicReadOnly);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      res.on("close", () => {
        transport.close().catch(() => {});
        server.close().catch(() => {});
      });
      try {
        await server.connect(transport);
        const body = req.method === "POST" ? await readBody(req) : undefined;
        await transport.handleRequest(req, res, body);
      } catch (err) {
        log.error("mcp http request failed:", err instanceof Error ? err.message : String(err));
        if (!res.headersSent) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "internal_error" }));
        }
      }
      return;
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not_found", hint: "POST /mcp for MCP, GET /health for health" }));
  });

  httpServer.listen(cfg.port, () => {
    log.info(
      `started ${PKG_NAME}@${PKG_VERSION} transport=http port=${cfg.port} ` +
        `mode=${publicReadOnly ? "public-read-only" : "full"} ` +
        `tools=${(publicReadOnly ? TOOLS.filter((t) => t.skipAuth) : TOOLS).length} ` +
        `resources=${listGuideResources().length} prompts=${PROMPTS.length}`
    );
  });
}

/** Local transport: stdio, the default (spawned by an MCP client). */
async function startStdio(cfg: ReturnType<typeof config>): Promise<void> {
  const log = logger();
  const server = createMcpServer(cfg, false);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log.info(
    `started ${PKG_NAME}@${PKG_VERSION} transport=stdio env=${cfg.env} base=${cfg.baseURL} ` +
      `tools=${TOOLS.length} resources=${listGuideResources().length} prompts=${PROMPTS.length}` +
      (cfg.apiKey ? " auth=api-key" : cfg.bearerToken ? " auth=bearer" : " auth=NONE")
  );
}

async function main() {
  const cfg = config();
  if (cfg.transport === "http") {
    await startHttp(cfg);
  } else {
    await startStdio(cfg);
  }
}

main().catch((err) => {
  process.stderr.write(`[avenia-mcp:fatal] ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  process.exit(1);
});
