#!/usr/bin/env bash
# Avenia MCP Client — installer for Claude Code (and other MCP clients).
#
# Usage:
#   bash install.sh                   # interactive (prompts for PAT)
#   AVENIA_GH_PAT=ghp_xxx bash install.sh   # non-interactive
#
# Prereqs:
#   - Node.js v20+
#   - Claude Code CLI (`claude`)
#   - GitHub PAT (classic) with `read:packages` scope, from a user with access to the Avenia-io org

set -euo pipefail

GREEN="\033[0;32m"; YELLOW="\033[0;33m"; RED="\033[0;31m"; NC="\033[0m"
say() { printf "${GREEN}→${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}!${NC} %s\n" "$*"; }
fail() { printf "${RED}×${NC} %s\n" "$*" >&2; exit 1; }

# 1. Prereq checks
command -v node >/dev/null 2>&1 || fail "Node.js not found. Install Node 20+ from https://nodejs.org"
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
[[ "$NODE_MAJOR" -ge 20 ]] || fail "Node $NODE_MAJOR detected — need 20+"
command -v npm >/dev/null 2>&1 || fail "npm not found"
command -v claude >/dev/null 2>&1 || warn "claude CLI not found — package will install but Claude Code registration will be skipped"

# 2. Get PAT
if [[ -z "${AVENIA_GH_PAT:-}" ]]; then
  echo
  echo "You need a GitHub Personal Access Token (classic) with 'read:packages' scope."
  echo "Create one at: https://github.com/settings/tokens"
  echo
  read -r -s -p "Paste your GitHub PAT: " AVENIA_GH_PAT
  echo
fi
[[ -n "$AVENIA_GH_PAT" ]] || fail "no PAT provided"

# 3. Configure ~/.npmrc (idempotent — won't duplicate)
say "configuring ~/.npmrc"
NPMRC="$HOME/.npmrc"
touch "$NPMRC"
if ! grep -q "^@avenia-io:registry=" "$NPMRC"; then
  echo "@avenia-io:registry=https://npm.pkg.github.com" >> "$NPMRC"
fi
# Replace any existing avenia-io token; keep other npmrc entries intact
TMP=$(mktemp)
grep -v "^//npm.pkg.github.com/:_authToken=" "$NPMRC" > "$TMP" || true
echo "//npm.pkg.github.com/:_authToken=$AVENIA_GH_PAT" >> "$TMP"
mv "$TMP" "$NPMRC"
chmod 600 "$NPMRC"

# 4. Verify access before installing
say "verifying registry access"
if ! npm view @avenia-io/mcp-client version >/dev/null 2>&1; then
  fail "could not reach @avenia-io/mcp-client — check your PAT has read:packages and you're a member of Avenia-io"
fi

# 5. Install globally
say "installing @avenia-io/mcp-client globally"
npm install -g @avenia-io/mcp-client@latest

INSTALLED_VERSION=$(npm view @avenia-io/mcp-client version)
say "installed v$INSTALLED_VERSION"

# 6. Register with Claude Code (if available)
if command -v claude >/dev/null 2>&1; then
  say "registering with Claude Code (user scope)"
  claude mcp remove avenia >/dev/null 2>&1 || true

  ENV_ARGS=(--env "AVENIA_ENV=${AVENIA_ENV:-sandbox}")
  if [[ -n "${AVENIA_API_KEY:-}" ]]; then
    ENV_ARGS+=(--env "AVENIA_API_KEY=$AVENIA_API_KEY")
  fi

  claude mcp add --transport stdio --scope user avenia "${ENV_ARGS[@]}" -- mcp-client

  echo
  say "registered. Current MCP servers:"
  claude mcp list | sed 's/^/  /'
else
  warn "skipped Claude Code registration — install Claude Code and run:"
  echo "    claude mcp add --transport stdio --scope user avenia --env AVENIA_ENV=sandbox -- mcp-client"
fi

echo
say "done. Test it with:"
echo "    claude  # then ask: 'liste os recursos disponíveis no MCP da Avenia'"
