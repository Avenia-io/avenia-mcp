#!/usr/bin/env python3
"""Generate src/tools.ts from the Avenia OpenAPI spec."""
import json, re, sys, collections

SPEC_PATH = "/tmp/avenia-openapi.json"
OUT_PATH = "/Users/arioliveira/Avenia/Projects/avenia-mcp-public/src/tools.ts"

with open(SPEC_PATH) as f:
    spec = json.load(f)

paths = spec.get("paths", {})

# ---- name slug helpers ----
def slug(s: str) -> str:
    s = re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_").lower()
    s = re.sub(r"_+", "_", s)
    return s

# ---- derive default tool name from method + summary ----
def derive_name(method: str, path: str, summary: str) -> str:
    base = slug(summary) if summary else slug(path)
    return f"avenia_{base}"

# ---- request body schema inlining ----
def resolve_ref(ref: str):
    # "#/components/schemas/Foo"
    parts = ref.lstrip("#/").split("/")
    node = spec
    for p in parts:
        node = node.get(p, {}) if isinstance(node, dict) else {}
    return node

def deref(schema):
    """Recursively resolve $ref in a schema."""
    if not isinstance(schema, dict):
        return schema
    if "$ref" in schema:
        return deref(resolve_ref(schema["$ref"]))
    out = {}
    for k, v in schema.items():
        if isinstance(v, dict):
            out[k] = deref(v)
        elif isinstance(v, list):
            out[k] = [deref(x) if isinstance(x, dict) else x for x in v]
        else:
            out[k] = v
    return out

def trim_schema(schema, depth=0):
    """Keep only the fields JSON-Schema-for-MCP needs; drop OpenAPI extensions."""
    if not isinstance(schema, dict) or depth > 6:
        return schema
    keep = {}
    for k in ("type","properties","required","items","enum","format","description","additionalProperties","oneOf","anyOf","allOf","nullable","default","example"):
        if k in schema:
            v = schema[k]
            if k == "properties" and isinstance(v, dict):
                keep[k] = {pn: trim_schema(ps, depth+1) for pn, ps in v.items()}
            elif k in ("oneOf","anyOf","allOf") and isinstance(v, list):
                keep[k] = [trim_schema(x, depth+1) for x in v]
            elif k == "items":
                keep[k] = trim_schema(v, depth+1)
            elif k == "additionalProperties" and isinstance(v, dict):
                keep[k] = trim_schema(v, depth+1)
            else:
                keep[k] = v
    return keep

def param_schema(p):
    s = p.get("schema") or {}
    s = deref(s)
    s = trim_schema(s)
    if "description" not in s and p.get("description"):
        s["description"] = p["description"]
    if p.get("example") is not None and "example" not in s:
        s["example"] = p["example"]
    return s

tools = []
seen_names = set()

for path, methods in paths.items():
    for method, op in methods.items():
        if method.lower() not in ("get","post","put","patch","delete"):
            continue
        method_up = method.upper()
        summary = op.get("summary", "") or ""
        description = op.get("description", "") or summary or f"{method_up} {path}"
        op_id = op.get("operationId") or ""

        # derive name
        name = derive_name(method_up, path, summary)
        # handle collisions (e.g. Get Payment Session by ID appears in both Account and Payment Sessions)
        if name in seen_names:
            # disambiguate with tag
            tag = (op.get("tags") or ["x"])[0].lower().replace(" ", "_").replace("&","and")
            name = f"avenia_{tag}_{slug(summary)}" if summary else f"avenia_{tag}_{slug(path)}"
        # still collide? append method
        if name in seen_names:
            name = f"{name}_{method_up.lower()}"
        seen_names.add(name)

        params = op.get("parameters") or []
        path_params = [p for p in params if p.get("in") == "path"]
        query_params = [p for p in params if p.get("in") == "query"]

        properties = {}
        required = []

        # Path params: always required, always strings (per OpenAPI spec for Avenia they are uuid/tokens)
        for p in path_params:
            pname = p["name"]
            ps = param_schema(p)
            if "type" not in ps and not any(k in ps for k in ("oneOf","anyOf","allOf")):
                ps["type"] = "string"
            if "description" not in ps:
                ps["description"] = f"Path parameter: {pname}"
            properties[pname] = ps
            required.append(pname)

        # Query params
        for p in query_params:
            pname = p["name"]
            ps = param_schema(p)
            if "type" not in ps and not any(k in ps for k in ("oneOf","anyOf","allOf")):
                ps["type"] = "string"
            if p.get("required"):
                required.append(pname)
            properties[pname] = ps

        # Request body → unwrap into "body" arg OR inline as object
        body_unwrap = False
        has_body = False
        rb = op.get("requestBody") or {}
        rb_content = (rb.get("content") or {}).get("application/json") or {}
        rb_schema = deref(rb_content.get("schema") or {})
        if rb_schema:
            has_body = True
            trimmed = trim_schema(rb_schema)
            # If body is an object with its own properties, expose them as "body" (object)
            # to keep the tool input flat & type-checkable.
            properties["body"] = {
                **trimmed,
                "description": (trimmed.get("description") or "") + (" (request body)" if not (trimmed.get("description") or "").lower().endswith("body)") else "")
            }
            if rb.get("required"):
                required.append("body")
            body_unwrap = True

        input_schema = {
            "type": "object",
            "properties": properties,
            "additionalProperties": False,
        }
        if required:
            input_schema["required"] = required

        tools.append({
            "name": name,
            "description": (summary + (" — " + description.split("\n")[0] if description and description != summary else "")).strip() or f"{method_up} {path}",
            "inputSchema": input_schema,
            "method": method_up,
            "pathTemplate": path,            # keep /v2 prefix; client.ts handles it
            "pathParams": [p["name"] for p in path_params],
            "queryParams": [p["name"] for p in query_params],
            "bodyUnwrap": body_unwrap,
            "skipAuth": (path == "/v2/public-key"),  # only truly public endpoint
        })

tools.sort(key=lambda t: t["name"])

# ---- Emit TS ----
ts = []
ts.append("// AUTO-GENERATED from the Avenia OpenAPI spec. Do not edit by hand.")
ts.append("// Source: https://api-reference.avenia.io/openapi.json")
ts.append("// Regenerate with: python3 scripts/gen_tools.py")
ts.append("")
ts.append('import type { HttpMethod } from "./client.js";')
ts.append("")
ts.append("export interface ToolDefinition {")
ts.append("  name: string;")
ts.append("  description: string;")
ts.append("  inputSchema: Record<string, unknown>;")
ts.append("  method: HttpMethod;")
ts.append("  pathTemplate: string;")
ts.append("  pathParams: string[];")
ts.append("  queryParams: string[];")
ts.append("  bodyUnwrap: boolean;")
ts.append("  skipAuth?: boolean;")
ts.append("}")
ts.append("")
ts.append(f"export const TOOLS: readonly ToolDefinition[] = {json.dumps(tools, indent=2, ensure_ascii=False)} as const;")
ts.append("")

with open(OUT_PATH, "w") as f:
    f.write("\n".join(ts))

print(f"Wrote {len(tools)} tools to {OUT_PATH}")
# print name collisions check
from collections import Counter
c = Counter(t["name"] for t in tools)
dups = [n for n,cnt in c.items() if cnt>1]
if dups:
    print("WARN: duplicate names:", dups)
else:
    print("OK: all tool names unique")
