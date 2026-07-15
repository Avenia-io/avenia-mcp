# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
