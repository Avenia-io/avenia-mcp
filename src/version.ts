import { readFileSync } from "node:fs";

/**
 * Single source of truth for the server version.
 *
 * Read from package.json at runtime (relative to this module) so the version
 * never has to be hand-synced across files. Works both in dev (`tsx src/…`,
 * resolves to the repo root) and in the published bundle (`dist/index.js`,
 * resolves to the package root, where npm always ships package.json).
 */
function readVersion(): string {
  try {
    const url = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(url, "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/** MCP server name (stable, distinct from the npm package name). */
export const SERVER_NAME = "avenia-mcp";

/** Current version, sourced from package.json. */
export const VERSION = readVersion();

/** User-Agent sent on every outbound HTTP request. */
export const USER_AGENT = `${SERVER_NAME}/${VERSION}`;
