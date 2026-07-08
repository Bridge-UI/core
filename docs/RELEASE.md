# Release guide

How to publish `@bridge-ui/core`, `@bridge-ui/react`, and `@bridge-ui/vue` to npm.

Releases are created on GitHub. Pushing a version tag triggers the [Bridge UI Release](https://github.com/Bridge-UI/core/actions/workflows/release.yml) workflow, which builds, tests, and publishes all three packages via [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC).

## Prerequisites

1. The [release workflow](../.github/workflows/release.yml) is merged on `main`.
2. **Trusted Publisher** is configured on npm for each package:
   - `@bridge-ui/core`
   - `@bridge-ui/react`
   - `@bridge-ui/vue`

   | Field                | Value                        |
   | -------------------- | ---------------------------- |
   | Organization or user | `Bridge-UI`                  |
   | Repository           | `core`                       |
   | Workflow filename    | `release.yml`                |
   | Allowed actions      | **Allow `npm publish`** only |

## Publish a new version

### 1. Prepare `main`

- Merge all changes for the release.
- Wait for CI to pass (lint, build, tests).

### 2. Bump versions

```bash
npm run bump-version -- 0.1.0
```

Commit with message: `chore(release): 0.1.0`, then push to `main`.

The git tag must match these versions (`v0.1.0` → `"version": "0.1.0"`). CI fails if they differ.

### 3. Create the release on GitHub

1. Open [Releases](https://github.com/Bridge-UI/core/releases) → **Draft a new release**.
2. **Choose a tag** — enter the new tag, e.g. `v0.1.0`.
   - For a new tag, select **Create new tag on publish**.
   - Target branch: `main`.
3. **Release title** — e.g. `v0.1.0`.
4. Add release notes (optional).
5. For pre-releases, check **Set as a pre-release** (visual only on GitHub).
6. Click **Publish release**.

### 4. CI publishes to npm

The tag push starts **Actions → Bridge UI Release**, which:

1. Verifies `package.json` versions and `peerDependencies` match the tag.
2. Runs `npm run build` and `npm run test:run`.
3. Publishes in order: `core` → `react` → `vue`.

### 5. Verify

- [GitHub Actions](https://github.com/Bridge-UI/core/actions/workflows/release.yml) — job succeeded.
- [npm](https://www.npmjs.com/org/bridge-ui) — new version on all three packages.

## Tag naming and npm dist-tags

The git tag name controls the npm dist-tag:

| Git tag            | npm dist-tag | Install                              |
| ------------------ | ------------ | ------------------------------------ |
| `v1.0.0`           | `latest`     | `npm install @bridge-ui/react`       |
| `v1.0.0-beta.1`    | `beta`       | `npm install @bridge-ui/react@beta`  |
| `v1.0.0-rc.1`      | `rc`         | `npm install @bridge-ui/react@rc`    |
| `v1.0.0-alpha.1`   | `alpha`      | `npm install @bridge-ui/react@alpha` |
| Other pre-releases | `next`       | `npm install @bridge-ui/react@next`  |

The **Set as a pre-release** checkbox on GitHub is for display only. The tag name is what matters for npm.

## Fixing a bad release

### Tag pushed by mistake (CI not finished)

Cancel the running job in GitHub Actions, then delete the release and tag on GitHub.

### Already published to npm

You cannot republish the same version. Options:

1. **Deprecate** the bad version:

   ```bash
   npm deprecate @bridge-ui/core@0.1.0 "Published by mistake — use 0.1.1"
   npm deprecate @bridge-ui/react@0.1.0 "Published by mistake — use 0.1.1"
   npm deprecate @bridge-ui/vue@0.1.0 "Published by mistake — use 0.1.1"
   ```

2. Publish a corrected version with a new tag (e.g. `v0.1.1`) via GitHub Releases.

**Unpublish** is only possible within 72 hours and if the version has no dependents.

## Security (optional)

After Trusted Publishing is working, consider enabling on each package:

**Package settings → Publishing access → Require two-factor authentication and disallow tokens**

This blocks token-based publishes while OIDC continues to work.
