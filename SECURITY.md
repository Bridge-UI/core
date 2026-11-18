# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue. Report it privately through [GitHub Security Advisories](https://github.com/Bridge-UI/core/security/advisories/new).

You will get an answer within a few days. Fixes are released as a new patch version and announced in the advisory.

## Supported versions

Only the latest published version of `@bridge-ui/core`, `@bridge-ui/react` and `@bridge-ui/vue` receives security fixes.

## Official packages

The only official packages are published under the [`@bridge-ui`](https://www.npmjs.com/org/bridge-ui) npm scope. Every version is published from GitHub Actions with [provenance](https://docs.npmjs.com/generating-provenance-statements); check it with `npm audit signatures`.

Packages with similar names outside that scope (for example `bridge-ui`) are **not** ours. The AI install CLI is always run as `npx --package=@bridge-ui/<react|vue> …`, never by bin name alone.
