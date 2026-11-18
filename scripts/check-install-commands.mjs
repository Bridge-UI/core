#!/usr/bin/env node
/**
 * Guards docs and AI resources against slopquatting.
 *
 * Every package named in an install command (`npm install`, `pnpm add`, …)
 * must be one this repo already knows (workspace packages and their declared
 * dependencies) or one listed in EXTRA_ALLOWED. Every `npx`-style runner must
 * name its package explicitly (`--package=` / `-p`), so a bin name can never
 * be resolved from the registry by accident.
 *
 * Usage: node scripts/check-install-commands.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Packages referenced in docs that are not dependencies of this repo.
const EXTRA_ALLOWED = ["@bridge-ui/adapters"];

const SCANNED = ["*.md", "*.mdx", "*.txt", "*.mjs"];

const INSTALL =
  /\b(?:npm (?:install|i|add)|pnpm (?:add|install|i)|yarn add|bun (?:add|install|i))((?: +[^\s`|&;#)'"]+)+)/g;
const RUNNER = /\b(?:npx|bunx|pnpm dlx|yarn dlx)((?: +[^\s`|&;#)'"]+)+)/g;

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

const allowed = new Set(EXTRA_ALLOWED);

for (const manifest of git(
  "ls-files",
  "package.json",
  "packages/*/package.json",
)) {
  const pkg = JSON.parse(readFileSync(manifest, "utf8"));

  if (pkg.name) allowed.add(pkg.name);

  for (const field of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    for (const name of Object.keys(pkg[field] ?? {})) allowed.add(name);
  }
}

/** `@scope/name@1.2.3` → `@scope/name`; `name@rc` → `name`. */
const stripVersion = (spec) => spec.replace(/(?<=.)@.*$/, "");

/** Template placeholders such as `${packageName}` or `@bridge-ui/<react|vue>`. */
const isPlaceholder = (token) => /[$<{]/.test(token);

const problems = [];

for (const file of git("ls-files", ...SCANNED)) {
  if (file === "scripts/check-install-commands.mjs") continue;

  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((line, index) => {
    const where = `${file}:${index + 1}`;

    for (const [, args] of line.matchAll(INSTALL)) {
      for (const token of args.trim().split(/ +/)) {
        if (token.startsWith("-") || isPlaceholder(token)) continue;

        const name = stripVersion(token);

        if (!allowed.has(name))
          problems.push(
            `${where}: unknown package "${name}" in install command`,
          );
      }
    }

    for (const [match, args] of line.matchAll(RUNNER)) {
      const tokens = args.trim().split(/ +/);
      const pkgFlag = tokens.findIndex(
        (t) => t === "-p" || t === "--package" || t.startsWith("--package="),
      );

      if (pkgFlag === -1) {
        problems.push(
          `${where}: "${match.trim()}" must name its package with --package=<name>`,
        );
        continue;
      }

      const spec = tokens[pkgFlag].startsWith("--package=")
        ? tokens[pkgFlag].slice(10)
        : tokens[pkgFlag + 1];

      if (spec && !isPlaceholder(spec) && !allowed.has(stripVersion(spec))) {
        problems.push(
          `${where}: unknown package "${stripVersion(spec)}" in --package`,
        );
      }
    }
  });
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  console.error(
    `\n${problems.length} problem(s). Add genuinely new packages to EXTRA_ALLOWED in ${import.meta.filename}.`,
  );
  process.exit(1);
}

console.log(`Install commands OK (${allowed.size} known packages).`);
