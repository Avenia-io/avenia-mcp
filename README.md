<h1>Avenia MCP Server<img src="./assets/logo.png" align="right" width="102"/></h1>

[![npm version](https://img.shields.io/npm/v/@avenia/mcp-client.svg)](https://www.npmjs.com/package/@avenia/mcp-client)
[![docs](https://img.shields.io/badge/docs-api--reference.avenia.io-0a0a0a)](https://api-reference.avenia.io)
[![license](https://img.shields.io/npm/l/@avenia/mcp-client.svg)](LICENSE)

The official [Model Context Protocol](https://modelcontextprotocol.io/) server for [Avenia](https://avenia.io) — borderless liquidity infrastructure connecting LatAm to the world.

## What This MCP Server Does

This MCP server plugs AI assistants (Cursor, Claude Code, Claude Desktop, Codex, Zed, and any other MCP-compatible client) directly into the Avenia platform. It exposes 92 tools — one per public API endpoint — that let an assistant:

- Create and manage **sub-accounts** and **accesses** for your organization
- Move money via **tickets**: Pix pay-ins, PIX / wire pay-outs, FX conversions, and on-chain stablecoin transfers
- Get **fixed-rate quotes** with full markup-fee control (BRL, USD, EUR, ARS, USDC, USDT, BRZ, and more)
- Manage **beneficiaries**: wallets + BRL / USD / EUR / ARS bank accounts
- Run **KYC** flows (Level 1 API, Web SDK, W8-BEN) and track attempts
- Handle **documents**, **webhooks** (register / update / delete / inspect delivery attempts), and **email notifications**
- Administer **API keys** with programmatic rotation

Full list: run `listTools` from any MCP client once connected, or see the [API reference](https://api-reference.avenia.io).

## Prerequisites

**Get your API key:**

1. [Create an account on Avenia](https://app.avenia.io/sign-up)
2. Complete KYC and pick your environment (sandbox or production)
3. Open the dashboard, go to **Settings → API Keys**, and create a new key
4. Copy the key — you won't be able to see it again

**Dependencies you need to have installed:**

- [Node.js](https://nodejs.org/en/download) (v20 or newer)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Check with `node -v` and `npm -v`.

## Installation

### Claude Code

Run the following command in your terminal:

```bash
claude mcp add --transport stdio avenia \
  --env AVENIA_API_KEY=your-api-key-here \
  --env AVENIA_ENV=sandbox \
  -- npx -y @avenia/mcp-client
```

### Cursor

One-click install:

[Add MCP to Cursor](https://cursor.com/en-US/install-mcp?name=avenia&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBhdmVuaWEvbWNwLWNsaWVudCJdLCJlbnYiOnsiQVZFTklBX0FQSV9LRVkiOiJ5b3VyLWFwaS1rZXktaGVyZSIsIkFWRU5JQV9FTlYiOiJzYW5kYm94In19)

After installation, set your API key in `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "avenia": {
      "command": "npx",
      "args": ["-y", "@avenia/mcp-client"],
      "env": {
        "AVENIA_API_KEY": "your-api-key-here",
        "AVENIA_ENV": "sandbox"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop configuration file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "avenia": {
      "command": "npx",
      "args": ["-y", "@avenia/mcp-client"],
      "env": {
        "AVENIA_API_KEY": "your-api-key-here",
        "AVENIA_ENV": "sandbox"
      }
    }
  }
}
```

### Codex

```bash
codex mcp add avenia \
  --env AVENIA_API_KEY=your-api-key-here \
  --env AVENIA_ENV=sandbox \
  -- npx -y @avenia/mcp-client
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.avenia]
command = "npx"
args = ["-y", "@avenia/mcp-client"]

[mcp_servers.avenia.env]
AVENIA_API_KEY = "your-api-key-here"
AVENIA_ENV = "sandbox"
```

### Docker

```bash
docker run --rm -i \
  -e AVENIA_API_KEY=your-api-key-here \
  -e AVENIA_ENV=sandbox \
  ghcr.io/avenia-tech/avenia-mcp:latest
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AVENIA_API_KEY` | ✓ | — | API key from the Avenia dashboard. Sent as `X-API-Key`. |
| `AVENIA_BEARER_TOKEN` | alt. | — | Short-lived JWT from a login flow. Sent as `Authorization: Bearer`. |
| `AVENIA_ENV` | | `sandbox` | `sandbox` or `production`. |
| `AVENIA_API_BASE_URL` | | derived | Override the base URL (advanced). |
| `AVENIA_TIMEOUT_MS` | | `60000` | Per-request HTTP timeout. |
| `AVENIA_LOG_LEVEL` | | `info` | `silent` / `error` / `info` / `debug` — logs go to stderr. |

## Example Prompts

Once configured, ask your AI assistant:

```
"Get me a fixed-rate quote for sending R$ 10,000 via Pix to USDC on Polygon"

"List all tickets from the last 7 days that are still pending"

"Create a BRL beneficiary named 'Fornecedor ACME' with Pix key contato@acme.com.br"

"Show me my current balances and daily limits"

"Register a webhook at https://mysite.com/hook for TICKET events"

"Create a sub-account for customer João Silva and send me the sub-account ID"

"What's the KYC status of sub-account sub_xxxxxxxx and what's still pending?"
```

> [!TIP]
> Use `AVENIA_ENV=sandbox` while testing. Everything runs against [sandbox.avenia.io](https://api.sandbox.avenia.io:10952/v2) — no real money, no real customers. Switch to `production` only when you're ready.

> [!NOTE]
> Sub-account operations accept `subAccountId` as a parameter on most tools. If your assistant doesn't pick it up automatically, mention it explicitly in your prompt (e.g. "…for sub-account sub_abc123…").

## Flows & Guides

Beyond the 92 tools, the server exposes two more MCP primitives so assistants can run real integration flows end-to-end:

### Prompts (ready-made flows)

Nine curated prompts map the most common integrations to a step-by-step plan. In Claude Code, Claude Desktop and Cursor these appear as slash commands (e.g. `/avenia_flow_pix_to_stablecoin_onchain`). Each takes typed arguments and returns a message the assistant can execute directly.

| Prompt | What it does |
|---|---|
| `avenia_flow_pix_to_stablecoin_onchain` | Accept Pix in BRL → convert to USDC/USDT → send on-chain to an external wallet |
| `avenia_flow_stablecoin_to_pix` | Spend a stablecoin balance → pay out via Pix to a BRL beneficiary |
| `avenia_flow_kyc_level_1` | Submit individual KYC L1 (API or Web SDK) and poll to approval |
| `avenia_flow_kyb_level_1_api` | Business KYB Level 1 via API |
| `avenia_flow_create_api_key` | Create an API key safely (MFA + JWE with the platform public key) |
| `avenia_flow_register_webhook` | Register a webhook + verify the first delivery signature |
| `avenia_flow_sandbox_mock_funds` | Credit mock Pix funds in sandbox for testing |
| `avenia_flow_create_subaccount_with_kyc` | Create a sub-account and run KYC/KYB on it |
| `avenia_flow_payout_brcode` | Pay a dynamic Pix BR Code (copia-e-cola) |

### Resources (integration-guide docs)

Every page of the [Integration Guide](https://integration-guide.avenia.io) is exposed as an MCP resource at `avenia-guide://<id>`. The assistant can list all 36 guides via `resources/list` and read any of them on demand via `resources/read`. The server fetches the live page, strips navigation chrome, and returns clean markdown — always up-to-date with the docs site, no stale bundled copies.

Representative guides (see `resources/list` for the full catalog):

- `avenia-guide://operations-quotes-and-tickets` — how quotes become tickets
- `avenia-guide://operations-combinations` — valid currency × payment-method combos
- `avenia-guide://usecase-pix2stable-onchain` — Pix → stablecoin → on-chain
- `avenia-guide://webhooks-verifying-authenticity` — verifying webhook signatures with the platform public key
- `avenia-guide://security-api-keys-management` — API key lifecycle with JWE
- `avenia-guide://kyc-level-1` / `avenia-guide://kyb-level-1-api` — identity verification flows

## Documentation

- [API Reference](https://api-reference.avenia.io) — full endpoint docs with request/response schemas
- [Integration Guide](https://api-reference.avenia.io/quickstart) — concepts: tickets, quotes, payment methods, KYC levels
- [MCP Protocol](https://modelcontextprotocol.io/) — how the underlying protocol works

## Support

- **Issues**: [GitHub Issues](https://github.com/avenia-tech/avenia-mcp/issues)
- **Email**: [developers@avenia.io](mailto:developers@avenia.io)
- **Status**: [status.avenia.io](https://status.avenia.io)

## License

This project is licensed under the [MIT License](LICENSE).

Made with ♥ by the [Avenia](https://avenia.io) team.
