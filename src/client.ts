import { request } from "undici";
import { config, logger } from "./config.js";
import { AveniaApiError, MissingCredentialError } from "./errors.js";
import { USER_AGENT } from "./version.js";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiRequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Override per-request timeout (ms). */
  timeoutMs?: number;
  /** Skip the auth header — only used for endpoints that don't require it (e.g. public-key). */
  skipAuth?: boolean;
}

export async function apiRequest<T = unknown>(
  method: HttpMethod,
  path: string,
  opts: ApiRequestOptions = {}
): Promise<T> {
  const cfg = config();
  const log = logger();

  const url = new URL(cfg.baseURL.replace(/\/v2$/, "") + ensureV2Prefix(path));
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
    ...(opts.headers ?? {}),
  };

  if (!opts.skipAuth) {
    if (cfg.apiKey) {
      headers["X-API-Key"] = cfg.apiKey;
    } else if (cfg.bearerToken) {
      headers["Authorization"] = `Bearer ${cfg.bearerToken}`;
    } else {
      throw new MissingCredentialError();
    }
  }

  let body: string | Buffer | undefined;
  if (opts.body !== undefined && opts.body !== null) {
    if (typeof opts.body === "string" || Buffer.isBuffer(opts.body)) {
      body = opts.body;
    } else {
      body = JSON.stringify(opts.body);
      if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
    }
  }

  const timeoutMs = opts.timeoutMs ?? cfg.timeoutMs;
  log.debug(`${method} ${url.pathname}${url.search}`);

  const res = await request(url, {
    method,
    headers,
    body,
    headersTimeout: timeoutMs,
    bodyTimeout: timeoutMs,
  });

  const text = await res.body.text();
  const parsed = text ? safeJson(text) : null;

  if (res.statusCode >= 400) {
    log.debug(`← ${res.statusCode} ${method} ${url.pathname}`);
    throw new AveniaApiError(method, url.pathname, res.statusCode, parsed ?? text);
  }

  log.debug(`← ${res.statusCode} ${method} ${url.pathname}`);
  return (parsed ?? null) as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function ensureV2Prefix(path: string): string {
  if (path.startsWith("/v2/")) return path;
  if (path.startsWith("/")) return `/v2${path}`;
  return `/v2/${path}`;
}
