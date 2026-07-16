# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1]

### Added
- **Docs tools** — `avenia_list_guides`, `avenia_read_guide`, `avenia_list_flows`, `avenia_get_flow`. The guides and flows were already exposed as MCP resources and prompts, but tool-centric clients (e.g. claude.ai connectors) don't surface those, so the same documentation is now reachable via read-only tools. Exposed on every transport, including the public read-only endpoint. All carry `title` + `readOnlyHint` annotations (also helps a future Connectors Directory submission).

### Fixed
- Reading a guide (the `avenia_read_guide` tool and the `avenia-guide://` resources) failed on the trailing-slash 301 that guide URLs issue. Switched the guide fetch from undici's `request`+`maxRedirections` to native `fetch`, which follows redirects reliably.

### Added
- **Remote HTTP transport (Streamable HTTP).** Set `AVENIA_TRANSPORT=http` (with `PORT`, default 8080) to run as an HTTP server exposing `POST /mcp` and `GET /health`. Defaults to a **public read-only** mode: only the guides, the flow prompts and `avenia_get_public_key` are exposed; the credential-bearing tools are hidden and refuse to run — so no secrets ever touch a shared endpoint. Powers the hosted `mcp.avenia.io` docs endpoint. The default transport stays **stdio** (local/npx behaviour is unchanged). `AVENIA_HTTP_FULL=true` exposes all tools over HTTP for a trusted, non-public deployment.

## [0.2.2]

### Added
- New prompt **`avenia_flow_create_api_key`** that guides the real API-key creation flow (login → validate → MFA/TOTP → create key with your RSA public key). Keys are created via the API behind MFA — not a dashboard.

### Changed
- README: clarified that the **API key is optional** (keyless explore mode), and corrected how accounts and keys are obtained — accounts are provisioned by the Avenia team (no self-service sign-up), and keys are created via the API behind MFA, not a dashboard. Updated prerequisites, install intro, and the environment-variables table.
- Corrected the `MissingCredentialError` message and the server instructions, which previously implied keys are created in the dashboard.

## [0.2.1]

### Added
- **MCP Bundle (`.mcpb`)** for one-click install in Claude Desktop — the user opens the bundle and fills a config form (API key optional; environment defaults to sandbox). No terminal, no JSON, no Node install. Attached to the GitHub release. Note: `.mcpb` bundles do not auto-update — grab the latest on each release.

### Changed
- Strengthened the server-instructions guardrail: it now states up front that `docs.avenia.io` does not exist and that assistants must use `api-reference.avenia.io` / read the `avenia-guide://` resources instead of web-fetching Avenia URLs.

## [0.2.0]

First public npm release.

### Added
- Published to the public npm registry as `@avenia-io/mcp-client` — install with a single
  `npx -y @avenia-io/mcp-client` (no clone/build step).
- `SECURITY.md` with the credential-handling model and vulnerability reporting process.
- Smoke tests for the tool registry, the HTTP client (auth headers, URL building, error
  mapping) and the guide resources.
- `CHANGELOG.md`.

### Changed
- Version is now sourced from `package.json` at runtime (single source of truth) instead of
  being hard-coded across `src/index.ts`, `src/client.ts` and `src/resources.ts`.
- README leads with the `npx` install; from-source instructions kept for contributors.

### Removed
- Private GitHub Packages publishing flow (`.npmrc` scope registry). The package ships on the
  public npm registry.

## [0.1.2]

- Internal preview: install from source (clone + build). 66 tools, 8 flow prompts, and the
  integration-guide resources.
