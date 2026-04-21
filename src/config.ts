const ENV_TO_URL: Record<string, string> = {
  sandbox: "https://api.sandbox.avenia.io:10952/v2",
  production: "https://api.avenia.io:8443/v2",
};

export type LogLevel = "silent" | "error" | "info" | "debug";

const LOG_LEVELS: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  info: 2,
  debug: 3,
};

function readEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export interface Config {
  apiKey: string | undefined;
  bearerToken: string | undefined;
  baseURL: string;
  env: "sandbox" | "production" | "custom";
  timeoutMs: number;
  logLevel: LogLevel;
}

export function loadConfig(): Config {
  const explicitBase = readEnv("AVENIA_API_BASE_URL");
  const envName = (readEnv("AVENIA_ENV") ?? "sandbox").toLowerCase();

  let baseURL: string;
  let env: Config["env"];
  if (explicitBase) {
    baseURL = explicitBase.replace(/\/+$/, "");
    env = "custom";
  } else if (envName in ENV_TO_URL) {
    baseURL = ENV_TO_URL[envName];
    env = envName as "sandbox" | "production";
  } else {
    throw new Error(
      `AVENIA_ENV must be "sandbox" or "production" (got "${envName}"). ` +
        `Or set AVENIA_API_BASE_URL to override.`
    );
  }

  const apiKey = readEnv("AVENIA_API_KEY");
  const bearerToken = readEnv("AVENIA_BEARER_TOKEN");

  const timeoutRaw = readEnv("AVENIA_TIMEOUT_MS");
  const timeoutMs = timeoutRaw ? Math.max(1000, Number(timeoutRaw) || 60_000) : 60_000;

  const logRaw = (readEnv("AVENIA_LOG_LEVEL") ?? "info").toLowerCase() as LogLevel;
  const logLevel: LogLevel = logRaw in LOG_LEVELS ? logRaw : "info";

  return { apiKey, bearerToken, baseURL, env, timeoutMs, logLevel };
}

let cached: Config | undefined;
export function config(): Config {
  if (!cached) cached = loadConfig();
  return cached;
}

export function logger() {
  const level = LOG_LEVELS[config().logLevel];
  const emit = (tag: string, minLevel: number, args: unknown[]) => {
    if (level >= minLevel) {
      process.stderr.write(`[avenia-mcp:${tag}] ${args.map(formatArg).join(" ")}\n`);
    }
  };
  return {
    error: (...args: unknown[]) => emit("error", LOG_LEVELS.error, args),
    info: (...args: unknown[]) => emit("info", LOG_LEVELS.info, args),
    debug: (...args: unknown[]) => emit("debug", LOG_LEVELS.debug, args),
  };
}

function formatArg(a: unknown): string {
  if (typeof a === "string") return a;
  try {
    return JSON.stringify(a);
  } catch {
    return String(a);
  }
}
