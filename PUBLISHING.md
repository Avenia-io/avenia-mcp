# Publishing Guide

Maintainer-only runbook for publishing `@avenia-io/mcp-client`. Two flows are documented:

1. **Current state** — private package on **GitHub Packages** under the `Avenia-io` org.
2. **Future state** — public package on **npmjs.com** (when we're ready to release publicly).

End users never need this file. They follow the install instructions in `README.md`.

---

## Current: Private (GitHub Packages)

### One-time setup

#### 1. PAT for publishing

[github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)**

- Name: `avenia-mcp-publish`
- Expiration: 90 days
- Scopes: `write:packages` (includes `read:packages`) + `repo`

Store the `ghp_…` somewhere safe (1Password, etc.). Do NOT commit it.

#### 2. Project-local `.npmrc`

Create `.npmrc` in the project root (`.npmrc` is in `.gitignore` and must NOT be committed):

```
@avenia-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then export the token in your shell only when publishing:

```bash
export GITHUB_TOKEN=ghp_your_publish_token
```

### Publish a release

```bash
git status                    # working tree must be clean
git pull --rebase             # be on latest main / release branch

npm install                   # ensure deps are fresh
npm test                      # 5/5 must pass
npm run typecheck             # no errors
npm run build                 # regenerate dist/

npm publish --dry-run         # confirm tarball contents (5 files, ~21 kB)
npm publish                   # → @avenia-io/mcp-client@<version>
```

Verify: <https://github.com/orgs/Avenia-io/packages>

### Bump version

```bash
npm version patch             # 0.1.0 → 0.1.1 (bug fix)
npm version minor             # 0.1.0 → 0.2.0 (feature)
npm version major             # 0.1.0 → 1.0.0 (breaking)
git push && git push --tags
npm publish
```

---

## Future: Public (npmjs.com)

When we're ready to flip the package to public, follow this once:

### 1. Reserve the npm scope

- Go to <https://www.npmjs.com/org/create>
- Create org `avenia-io` (must be lowercase). Free tier covers public packages.
- Enable 2FA on the npm account.

### 2. Update `package.json`

```diff
 "publishConfig": {
-  "registry": "https://npm.pkg.github.com",
+  "registry": "https://registry.npmjs.org",
   "access": "public"
 }
```

### 3. Update `README.md`

- Re-add the `npm version` badge:
  ```md
  [![npm version](https://img.shields.io/npm/v/@avenia-io/mcp-client.svg)](https://www.npmjs.com/package/@avenia-io/mcp-client)
  ```
- Re-add the Cursor one-click install link (encode the new `@avenia-io/mcp-client` config).
- Remove the **"Get a GitHub PAT for the private registry"** subsection from Prerequisites.
- Remove the `> [!NOTE]` about `~/.npmrc` at the end of Installation.
- Remove the `> Internal preview.` blockquote at the top.
- Optionally restore the `internal-preview` status badge to a `released` one.

### 4. First public publish

```bash
npm logout                                              # clear any GH Packages auth
npm login --registry=https://registry.npmjs.org         # 2FA required
npm version minor                                       # bump to e.g. 0.2.0
npm run build && npm test
npm publish --access public
```

Verify: <https://www.npmjs.com/package/@avenia-io/mcp-client>

### 5. Make the GitHub repo public (optional)

`Settings → Danger Zone → Change repository visibility → Make public`. The package on GH Packages becomes obsolete (we publish to npmjs.com from now on); you can delete it from <https://github.com/orgs/Avenia-io/packages> if you want.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm publish` → `403 Forbidden` | PAT missing `write:packages` or `repo` scope | Regenerate PAT with both scopes |
| `npm publish` → `404 Not Found` | `package.json.name` scope ≠ GitHub org name | Confirm `name` is `@avenia-io/...` and org is `Avenia-io` |
| `npm publish` → `400 Bad Request: package needs to be linked to a repository` | Repo URL missing or wrong | `repository.url` must point at `github.com/Avenia-io/avenia-mcp.git` |
| End user `npx` → `404` | Their `~/.npmrc` missing the `@avenia-io:registry` line | Re-run the PAT setup from `README.md` |
| End user `npx` → `401 Unauthorized` | PAT expired or missing `read:packages` | Regenerate PAT |

---

## Security checklist before each publish

- [ ] `npm audit --omit=dev` shows **0 vulnerabilities**
- [ ] `.npmrc` is NOT in the committed tree (`git ls-files | grep .npmrc` is empty)
- [ ] No `*.tgz` artifacts are tracked (`*.tgz` is in `.gitignore`)
- [ ] `npm pack --dry-run` shows only `LICENSE`, `README.md`, `dist/index.js`, `dist/index.d.ts`, `package.json` (5 files)
- [ ] `git status` is clean before tagging
