# Avenia MCP

Official Model Context Protocol server for the [Avenia public API](https://api-reference.avenia.io). Plug your AI assistant (Claude Code, Cursor, Zed, Claude Desktop, or any MCP-compatible client) into the Avenia platform and start orchestrating payments, KYC, quotes, beneficiaries, sub-accounts, webhooks and more — without writing a line of integration code.

92 tools, one per API endpoint. Generated directly from the Avenia OpenAPI spec so it stays in lockstep with the platform.

## Install

### npx (recommended — zero install)

```bash
claude mcp add avenia -- npx -y @avenia/mcp-client
```

### Global install

```bash
npm install -g @avenia/mcp-client
claude mcp add avenia -- avenia-mcp
```

### Docker

```bash
claude mcp add avenia -- docker run --rm -i \
  -e AVENIA_API_KEY \
  -e AVENIA_ENV \
  ghcr.io/avenia-tech/avenia-mcp:latest
```

## Configure

Set your credentials and target environment via environment variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `AVENIA_API_KEY` | ✓ (or bearer token) | — | API key from the Avenia portal. Sent as `X-API-Key`. |
| `AVENIA_BEARER_TOKEN` | ✓ (or API key) | — | JWT from a login flow. Sent as `Authorization: Bearer`. |
| `AVENIA_ENV` | | `sandbox` | `sandbox` or `production`. |
| `AVENIA_API_BASE_URL` | | derived | Override the base URL (advanced). |
| `AVENIA_TIMEOUT_MS` | | `60000` | HTTP timeout per request. |
| `AVENIA_LOG_LEVEL` | | `info` | `silent` / `error` / `info` / `debug`. Logs go to stderr. |

Minimal `~/.claude/settings.json` example:

```json
{
  "mcpServers": {
    "avenia": {
      "command": "npx",
      "args": ["-y", "@avenia/mcp-client"],
      "env": {
        "AVENIA_API_KEY": "av_sandbox_...",
        "AVENIA_ENV": "sandbox"
      }
    }
  }
}
```

## What you can do

Once connected, ask your assistant in natural language:

- *"List my BRL bank account beneficiaries"* → `avenia_get_beneficiary_brl_bank_accounts`
- *"Quote a BRL→USDC conversion for R$ 10,000 via Pix"* → `avenia_get_fixed_rate_quote`
- *"Create a ticket to send 500 USDC on Polygon to beneficiary wallet X"* → `avenia_create_ticket`
- *"Show me all tickets created in the last 7 days"* → `avenia_get_tickets`
- *"Register a webhook at https://mysite.com/hook for ticket updates"* → `avenia_register_webhook`
- *"Create a sub-account for customer John Doe"* → `avenia_create_sub_account`
- *"What's my KYC status and what's still pending?"* → `avenia_get_attempts` + `avenia_get_access_info`

### Endpoint coverage

| Area | Tools | Notes |
|---|---|---|
| Account | balances, limits, statement, metadata, access-info, account-info | Per-account and per-sub-account |
| Sub-accounts | create, list, get | |
| Beneficiaries | wallets + bank accounts (BRL / USD / EUR / ARS) | create / list / get / delete |
| Quotes | fixed-rate | Full markup fee control |
| Tickets | create, list, get, receipt | On-ramps, off-ramps, conversions, on-chain sends |
| Payment sessions | create, list, get, preferences, fixed-quote, ticket | Public + private flows |
| Pix | BRL fiat rail, Pix key lookup, static BR Code | |
| KYC | Level 1 API & Web SDK, W8-BEN, attempts, import-token | |
| Documents | upload, list, get | |
| Auth & accesses | create account, login, MFA TOTP, accesses CRUD, API keys CRUD | |
| Webhooks | register / update / delete / events / delivery attempts | 12 tools |
| Notifications | email config (get/upsert) | |
| Public key | fetch JWE/JWS key | For sensitive payload encryption |

Run `listTools` from any MCP client to see the full, live catalog.

## Authentication

Two ways:

### 1. API key (recommended for server-to-server / AI assistants)

Generate one at the Avenia portal and export:

```bash
export AVENIA_API_KEY=av_live_...
export AVENIA_ENV=production
```

All tools use this key via the `X-API-Key` header.

### 2. Bearer token (short-lived JWT)

Already have a JWT from a user login flow? Pass it in `AVENIA_BEARER_TOKEN`. The MCP will use `Authorization: Bearer <token>`.

If both are set, **`AVENIA_API_KEY` wins**.

### Running the login flow from within the MCP

The MCP exposes `avenia_login_step_1` + `avenia_validate_login_step_2` + `avenia_refresh_token` as tools. You can log in through an MCP client by chaining them, then feed the resulting access token back in via `AVENIA_BEARER_TOKEN` on restart. A stateful session variant is on the roadmap.

## Development

```bash
git clone https://github.com/avenia-tech/avenia-mcp
cd avenia-mcp
npm install
npm run build
npm test
```

### Regenerating the tool catalog

The tool table in `src/tools.ts` is generated from the Avenia OpenAPI spec. To refresh after an API change:

```bash
curl -s https://api-reference.avenia.io/openapi.json -o /tmp/avenia-openapi.json
python3 scripts/gen_tools.py
npm run build
```

### Local smoke test

```bash
AVENIA_API_KEY=av_sandbox_... \
AVENIA_ENV=sandbox \
AVENIA_LOG_LEVEL=debug \
node dist/index.js < /dev/null
```

The server waits on stdin for JSON-RPC. Point an MCP inspector at it, or wire it into Claude Code with `claude mcp add avenia-local -- node $(pwd)/dist/index.js`.

## License

MIT — see [LICENSE](./LICENSE).
