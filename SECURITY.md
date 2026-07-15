# Security Policy

## Reporting a vulnerability

Please report security issues **privately**. Do not open a public GitHub issue for a
vulnerability.

- Email: **security@avenia.io** (or **developers@avenia.io**)

Include a description, reproduction steps, and impact. We aim to acknowledge reports within a
few business days.

## Your API key never leaves your machine

This MCP server runs **locally**, as a subprocess spawned by your MCP client (Claude Code,
Cursor, Claude Desktop, Codex, Zed, …). The Avenia API key (or bearer token) you configure is:

- read from your local environment (`AVENIA_API_KEY` / `AVENIA_BEARER_TOKEN`);
- sent **only** to the Avenia API over HTTPS, as the `X-API-Key` / `Authorization` header;
- **never** transmitted to, logged by, or stored on any Avenia-operated MCP endpoint.

Avenia does not proxy or receive your credential through this tool. It is the same trust model
as calling the Avenia API directly from your own machine.

Credentials are never written to logs. Logs go to stderr and never include the key.

## Sandbox first

The server defaults to `AVENIA_ENV=sandbox` (`api.sandbox.avenia.io`). No real money or real
customers are involved until you explicitly switch to `production`. API keys are
environment-bound — a sandbox key will not work in production and vice versa.

## Handling money-moving operations

Many tools move money or create real records (tickets, pay-outs, conversions, beneficiaries,
KYC). Treat the credential like any production secret, prefer sandbox while developing, and
review what an assistant is about to do before approving credential-bearing actions.

## Supported versions

Security fixes are applied to the latest published minor version.
