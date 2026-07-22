<h1>Avenia MCP Server<img src="./assets/logo.png" align="right" width="102"/></h1>

![status](https://img.shields.io/badge/status-preview-orange)
[![docs](https://img.shields.io/badge/docs-api--reference.avenia.io-0a0a0a)](https://api-reference.avenia.io)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Up-to-date Avenia APIs, docs, and integration guides for AI agents.**

The official [Model Context Protocol](https://modelcontextprotocol.io/) server for [Avenia](https://avenia.io) — borderless payments infrastructure linking Latin America to the world. It gives AI agents live access to Avenia's integration guides, ready-made flows, endpoint specs with request schemas, and authentication guidance — so they can discover services, retrieve the right guide, and generate accurate integration code without relying on stale training data.

> Zero-setup: add the hosted endpoint **`https://mcp.avenia.io/mcp`** as a remote connector (docs & specs, no credentials). Or install locally with a single `npx` command to run live operations — defaults to **sandbox**.

## What This MCP Server Does

This MCP server plugs AI assistants (claude.ai, Cursor, Claude Code, Claude Desktop, Codex, Zed, and any other MCP-compatible client) directly into the Avenia platform. It exposes 66 API tools — one per public API endpoint — plus 6 documentation tools (list/read guides, list/get flows, list/describe endpoints) that let an assistant:

- Create and manage **sub-accounts** and **accesses** for your organization
- Move money via **tickets**: Pix pay-ins, PIX / wire pay-outs, FX conversions, and on-chain stablecoin transfers
- Get **fixed-rate quotes** with full markup-fee control (BRL, USD, EUR, ARS, USDC, USDT, BRLA, and more)
- Manage **beneficiaries**: wallets + BRL / USD / EUR / ARS bank accounts
- Run **KYC** flows (Level 1 API, Web SDK, W8-BEN) and track attempts
- Handle **documents**, **webhooks** (register / update / delete / inspect delivery attempts), and **email notifications**
- Administer **API keys** with programmatic rotation

Full list: run `listTools` from any MCP client once connected, or see the [API reference](https://api-reference.avenia.io).

## Two ways to use it

The server has two modes — and the first needs **no credentials**:

- **Explore / learn to integrate (no API key):** install it and ask your assistant how to integrate. It reads Avenia's guides and step-by-step flows bundled in the server (and can fetch the platform public key). Perfect for a first look, with zero setup.
- **Run live operations (with API key):** add an Avenia API key and the assistant can execute quotes, Pix, FX conversions, on-chain transfers, KYC, etc. Without a key, only these live tools are unavailable — the docs, flows and guides all still work.

**Accounts & API keys (only needed for live operations):**

Avenia accounts are **provisioned by the Avenia team** — there is no self-service sign-up. Contact your Avenia representative to get set up.

API keys are **not** created in a dashboard. You create them via the API, behind MFA: log in → enable MFA → create a key with your own RSA public key (the key is returned encrypted to you, then you decrypt it locally). The easiest path is to let your AI assistant walk you through it — connect the MCP (it works keyless) and run the **`/avenia_flow_create_api_key`** prompt. Reference: the [Integration Guide](https://integration-guide.avenia.io) (API Keys / MFA sections). Use a **sandbox** key while testing.

**Dependencies:**

- [Node.js](https://nodejs.org/en/download) v20 or newer (`node -v`) — ships with `npx`, which is all you need for the install below. `git` is only required if you build from source.

## Installation

### Connect the Avenia MCP to Claude (remote connector, no API key)

Avenia's documentation connector gives Claude live access to the API guides, integration flows and endpoint specs, right in the conversation. It is **read-only and asks for no credentials** — nothing in your account is accessed.

Connector URL: **`https://mcp.avenia.io/mcp`**

On Claude (Free, Pro and Max plans — web, desktop app or Cowork):

1. Open Claude and go to **Settings → Connectors** (or **Customize → Connectors**)
2. Click **Add custom connector**
3. Paste `https://mcp.avenia.io/mcp` and confirm (no OAuth fields needed)
4. Done — Avenia's documentation tools are available to Claude

On **Claude Team/Enterprise**, only an Owner/admin can enable connectors for the org (organization settings → Add custom connector, same URL); members then see it automatically. Any other MCP client that supports the Streamable HTTP transport works too.

Need live operations, not just docs? Use the local install below — your API key never leaves your machine.

Privacy: the hosted connector is read-only and credential-free — see the [privacy policy](https://mcp.avenia.io/privacy).

<details>
<summary><strong>Em português</strong></summary>

O conector de documentação da Avenia dá ao Claude acesso em tempo real aos guias de API, fluxos de integração e especificações de endpoints, direto na conversa. É **somente-leitura e não pede nenhuma credencial**.

URL do conector: `https://mcp.avenia.io/mcp`

No Claude (planos Free, Pro e Max): abra **Settings → Connectors** (ou **Customize → Connectors**) → **Add custom connector** → cole a URL e confirme. No Claude Team/Enterprise, só o Owner/admin habilita conectores para a organização. Precisa das operações ao vivo, não só docs? Use o pacote local (`npx -y @avenia-io/mcp-client` ou o `.mcpb` no Claude Desktop), onde a API key nunca sai da sua máquina.

</details>

No local install step either — your MCP client runs the server on demand with `npx`. The configs below include an API key for live operations; **to only explore the docs and flows, just omit the `AVENIA_API_KEY` line** and the server runs keyless.

### Claude Desktop — one-click bundle (no terminal)

Prefer zero setup? Download the latest **`.mcpb`** bundle from the [Releases page](https://github.com/Avenia-io/avenia-mcp/releases/latest) and open it — Claude Desktop installs it and shows a form to (optionally) paste your API key and pick the environment. Leave the key blank to browse docs and flows; add it to run live operations. Note: `.mcpb` bundles don't auto-update — grab the latest on each release.

### Claude Code

```bash
claude mcp add --transport stdio avenia \
  --env AVENIA_API_KEY=your-api-key-here \
  --env AVENIA_ENV=sandbox \
  -- npx -y @avenia-io/mcp-client
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "avenia": {
      "command": "npx",
      "args": ["-y", "@avenia-io/mcp-client"],
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
      "args": ["-y", "@avenia-io/mcp-client"],
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
  -- npx -y @avenia-io/mcp-client
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.avenia]
command = "npx"
args = ["-y", "@avenia-io/mcp-client"]

[mcp_servers.avenia.env]
AVENIA_API_KEY = "your-api-key-here"
AVENIA_ENV = "sandbox"
```

> [!TIP]
> `npx -y @avenia-io/mcp-client` always fetches the latest published version. Pin a specific version with `@avenia-io/mcp-client@x.y.z`.

<details>
<summary><strong>From source (for contributors)</strong></summary>

```bash
git clone https://github.com/Avenia-io/avenia-mcp.git
cd avenia-mcp
npm install
npm run build
```

Then point your client at the built entrypoint: replace `npx -y @avenia-io/mcp-client` in any config above with `node /absolute/path/to/avenia-mcp/dist/index.js` (absolute path — `~` is not expanded by most MCP clients).

</details>

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AVENIA_API_KEY` | live ops only | — | API key from the Avenia dashboard. Sent as `X-API-Key`. Omit to run keyless (docs, flows & guides work; live tools return a "credential required" message). |
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

Beyond the 66 tools, the server exposes two more MCP primitives so assistants can run real integration flows end-to-end:

### Prompts (ready-made flows)

Nine curated prompts map the most common integrations to a step-by-step plan. In Claude Code, Claude Desktop and Cursor these appear as slash commands (e.g. `/avenia_flow_pix_to_stablecoin_onchain`). Each takes typed arguments and returns a message the assistant can execute directly.

| Prompt | What it does |
|---|---|
| `avenia_flow_pix_to_stablecoin_onchain` | Accept Pix in BRL → convert to USDC/USDT → send on-chain to an external wallet |
| `avenia_flow_stablecoin_to_pix` | Spend a stablecoin balance → pay out via Pix to a BRL beneficiary |
| `avenia_flow_kyc_level_1` | Submit individual KYC L1 (API or Web SDK) and poll to approval |
| `avenia_flow_kyb_level_1_api` | Business KYB Level 1 via API |
| `avenia_flow_register_webhook` | Register a webhook + verify the first delivery signature |
| `avenia_flow_sandbox_mock_funds` | Credit mock Pix funds in sandbox for testing |
| `avenia_flow_create_subaccount_with_kyc` | Create a sub-account and run KYC/KYB on it |
| `avenia_flow_payout_brcode` | Pay a dynamic Pix BR Code (copia-e-cola) |
| `avenia_flow_create_api_key` | Guide creating an API key (login → MFA → create key; not a dashboard) |

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

- **Issues**: [GitHub Issues](https://github.com/Avenia-io/avenia-mcp/issues)
- **Email**: [developers@avenia.io](mailto:developers@avenia.io)
- **Status**: [status.avenia.io](https://status.avenia.io)

## License

This project is licensed under the [MIT License](LICENSE).

Made with ♥ by the [Avenia](https://avenia.io) team.
