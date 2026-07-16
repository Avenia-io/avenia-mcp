import { GUIDES, GUIDE_BY_ID, type Guide } from "./guides.js";
import { config, logger } from "./config.js";
import { USER_AGENT } from "./version.js";

/** MCP resource URI scheme for guides: avenia-guide://<id> */
export const GUIDE_URI_PREFIX = "avenia-guide://";

export interface ResourceDescriptor {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export function listGuideResources(): ResourceDescriptor[] {
  return GUIDES.map((g) => ({
    uri: `${GUIDE_URI_PREFIX}${g.id}`,
    name: `${g.category} — ${g.title}`,
    description: g.summary,
    mimeType: "text/markdown",
  }));
}

export function resolveGuideUri(uri: string): Guide | undefined {
  if (!uri.startsWith(GUIDE_URI_PREFIX)) return undefined;
  return GUIDE_BY_ID.get(uri.slice(GUIDE_URI_PREFIX.length));
}

// ---- fetch + cache ----

interface CacheEntry {
  body: string;
  fetchedAt: number;
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min
const cache = new Map<string, CacheEntry>();

export async function readGuide(guide: Guide): Promise<string> {
  const now = Date.now();
  const cached = cache.get(guide.id);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) return cached.body;

  const log = logger();
  log.debug(`fetch guide ${guide.id} ← ${guide.url}`);

  // Native fetch follows redirects (guide URLs 301 to a trailing slash) without
  // the bundling/redirect quirks of undici's request + maxRedirections.
  const res = await fetch(guide.url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(config().timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch guide ${guide.id}: HTTP ${res.status}`);
  }

  const html = await res.text();
  const extracted = extractArticle(html);
  const markdown = htmlToMarkdown(extracted);

  const body = [
    `# ${guide.title}`,
    ``,
    `_${guide.category} · [source](${guide.url})_`,
    ``,
    markdown.trim(),
  ].join("\n");

  cache.set(guide.id, { body, fetchedAt: now });
  return body;
}

// ---- HTML → Markdown ----

/** Pull the first <article>...</article>, drop breadcrumbs <nav> and article <footer>. */
function extractArticle(html: string): string {
  const m = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (!m) return html;
  let body = m[1];
  body = body.replace(/<nav\b[^>]*class="[^"]*breadcrumbs?[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "");
  body = body.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");
  body = body.replace(/<div\b[^>]*class="[^"]*tocCollapsible[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  body = body.replace(/<a\b[^>]*class="[^"]*hash-link[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");
  return body;
}

function htmlToMarkdown(src: string): string {
  let s = src;

  // Code blocks (Docusaurus renders <pre><code class="language-xxx">...</code></pre>)
  s = s.replace(
    /<pre\b[^>]*>\s*<code\b[^>]*?(?:class="[^"]*language-(\w+)[^"]*")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_, lang, code) => `\n\n\`\`\`${lang ?? ""}\n${decodeEntities(stripTags(code))}\n\`\`\`\n\n`
  );
  // Standalone <pre>
  s = s.replace(
    /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi,
    (_, code) => `\n\n\`\`\`\n${decodeEntities(stripTags(code))}\n\`\`\`\n\n`
  );
  // Inline code
  s = s.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => `\`${decodeEntities(stripTags(code))}\``);

  // Headings
  s = s.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${inlineClean(t)}\n\n`);
  s = s.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${inlineClean(t)}\n\n`);
  s = s.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${inlineClean(t)}\n\n`);
  s = s.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${inlineClean(t)}\n\n`);
  s = s.replace(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n\n##### ${inlineClean(t)}\n\n`);
  s = s.replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `\n\n###### ${inlineClean(t)}\n\n`);

  // Links
  s = s.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => `[${inlineClean(t)}](${href})`);

  // Bold / italic
  s = s.replace(/<(?:b|strong)\b[^>]*>([\s\S]*?)<\/(?:b|strong)>/gi, "**$1**");
  s = s.replace(/<(?:i|em)\b[^>]*>([\s\S]*?)<\/(?:i|em)>/gi, "*$1*");

  // Line breaks / horizontal rules
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

  // Admonitions (Docusaurus info/warning/tip)
  s = s.replace(
    /<div\b[^>]*class="[^"]*theme-admonition[^"]*admonition_xJq3[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi,
    (_, inner) => `\n\n> ${inlineClean(inner).replace(/\n/g, "\n> ")}\n\n`
  );

  // Lists
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${inlineClean(t)}\n`);
  s = s.replace(/<\/?(ul|ol)\b[^>]*>/gi, "\n");

  // Paragraphs / divs
  s = s.replace(/<\/?(p|div|section|header|article|span)\b[^>]*>/gi, "\n");

  // Remaining tags → strip
  s = s.replace(/<[^>]+>/g, "");

  // Entities
  s = decodeEntities(s);

  // Whitespace cleanup
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function inlineClean(html: string): string {
  return decodeEntities(stripTags(html)).replace(/\s+/g, " ").trim();
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const ENTITY_TABLE: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "'",
  lsquo: "'",
  rdquo: "”",
  ldquo: "“",
  copy: "©",
  reg: "®",
  trade: "™",
  middot: "·",
  deg: "°",
  times: "×",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (full, name) => ENTITY_TABLE[name.toLowerCase()] ?? full);
}
