export class AveniaApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly method: string;
  readonly path: string;

  constructor(method: string, path: string, status: number, body: unknown) {
    const summary = summarize(body);
    super(`Avenia API ${status} ${method} ${path}${summary ? `: ${summary}` : ""}`);
    this.name = "AveniaApiError";
    this.status = status;
    this.body = body;
    this.method = method;
    this.path = path;
  }
}

export class MissingCredentialError extends Error {
  constructor() {
    super(
      "No Avenia credential configured. Set AVENIA_API_KEY (generate at https://portal.avenia.io) " +
        "or AVENIA_BEARER_TOKEN (JWT from a login flow)."
    );
    this.name = "MissingCredentialError";
  }
}

function summarize(body: unknown): string {
  if (!body) return "";
  if (typeof body === "string") return body.slice(0, 400);
  if (typeof body === "object") {
    const obj = body as Record<string, unknown>;
    const msg = obj.message ?? obj.error ?? obj.detail;
    if (typeof msg === "string") return msg.slice(0, 400);
    try {
      return JSON.stringify(body).slice(0, 400);
    } catch {
      return "";
    }
  }
  return String(body).slice(0, 400);
}
