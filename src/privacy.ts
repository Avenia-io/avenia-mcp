/**
 * Privacy policy for the hosted Avenia MCP documentation endpoint
 * (mcp.avenia.io), served at GET /privacy. Required for listing in the
 * Anthropic Connectors Directory.
 */

export const PRIVACY_UPDATED = "2026-07-22";

export const PRIVACY_HTML = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light dark"/>
<title>Avenia MCP · Privacy Policy</title>
<style>
  body{margin:0;padding:48px 20px;font:16px/1.65 ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#23211c;background:#f6f4ef}
  @media (prefers-color-scheme:dark){body{color:#eceae4;background:#121212}a{color:#8b8dfd}h1,h2{color:#fff}}
  main{max-width:720px;margin:0 auto}
  h1{font-size:28px;letter-spacing:-.02em;margin:0 0 4px}
  .meta{color:#8a857a;font-size:13px;margin:0 0 32px}
  h2{font-size:19px;letter-spacing:-.01em;margin:32px 0 8px}
  a{color:#4648D6}
  li{margin:4px 0}
</style></head><body><main>
<h1>Avenia MCP — Privacy Policy</h1>
<p class="meta">Applies to the hosted connector at <strong>mcp.avenia.io</strong> · Last updated: ${PRIVACY_UPDATED}</p>

<h2>What this connector is</h2>
<p>The Avenia MCP documentation connector gives AI assistants read-only access to Avenia's public
integration documentation: API guides, integration flows, endpoint specifications, and the platform's
public webhook-verification key. It performs <strong>no account operations</strong> and requires
<strong>no authentication</strong> — there is no sign-up, no API key, and no access to any Avenia account.</p>

<h2>Data we access</h2>
<p><strong>None from your Avenia account.</strong> The connector cannot read balances, transactions,
customer data, or any other account information, because it holds no credentials and exposes no
authenticated operations.</p>

<h2>Data we process</h2>
<ul>
  <li><strong>Request metadata</strong> — like any web service, our servers see standard HTTP request
  data (IP address, user-agent, requested path, timestamp) and keep it briefly in operational logs
  for reliability and security monitoring.</li>
  <li><strong>Tool-call arguments</strong> — e.g. the ID of a guide your assistant asks to read.
  These are processed in memory to serve the request and are not used to build profiles.</li>
  <li>The <strong>content of your conversations</strong> with your AI assistant never reaches Avenia —
  only the specific tool calls the assistant chooses to make.</li>
</ul>

<h2>What we don't do</h2>
<ul>
  <li>No cookies, no trackers, no analytics identifiers.</li>
  <li>No selling or sharing of data with third parties for marketing.</li>
  <li>No retention of tool-call content beyond short-lived operational logs.</li>
</ul>

<h2>Infrastructure</h2>
<p>The endpoint is operated by Avenia and hosted on Google Cloud infrastructure. Documentation content
is fetched live from Avenia's own docs site (<a href="https://integration-guide.avenia.io">integration-guide.avenia.io</a>)
and cached in memory for up to 30 minutes.</p>

<h2>Running live operations instead</h2>
<p>Live API operations (quotes, payments, KYC, …) are not available on this hosted connector. They run
through the locally-installed server (<code>npx -y @avenia-io/mcp-client</code> or the Claude Desktop
bundle), where your API key stays on your machine and requests go directly from your machine to the
Avenia API — never through this hosted endpoint. Avenia's platform-level processing of API requests is
governed by your agreement with Avenia.</p>

<h2>Your choices &amp; contact</h2>
<p>You can disconnect the connector at any time in your AI client's settings. Questions, requests and
security reports: <a href="mailto:tech@avenia.io">tech@avenia.io</a>.</p>

<h2>Changes</h2>
<p>Updates to this policy are posted at this URL with a revised date above.</p>

<p class="meta" style="margin-top:40px">Avenia · <a href="https://avenia.io">avenia.io</a> ·
<a href="https://github.com/Avenia-io/avenia-mcp">github.com/Avenia-io/avenia-mcp</a></p>
</main></body></html>`;
