#!/usr/bin/env node
/**
 * Fails when package-lock.json resolves a package from anywhere other than the
 * public npm registry over HTTPS, or without a sha512 integrity hash.
 *
 * Usage: node scripts/check-lockfile.mjs [path/to/package-lock.json]
 */
import { readFileSync } from "node:fs";

const REGISTRY = "https://registry.npmjs.org/";

const lockPath = process.argv[2] ?? "package-lock.json";
const lock = JSON.parse(readFileSync(lockPath, "utf8"));
const problems = [];

for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  // Root project, workspace folders and workspace symlinks are local.
  if (
    path === "" ||
    !path.includes("node_modules/") ||
    entry.link ||
    entry.inBundle
  )
    continue;

  if (!entry.resolved?.startsWith(REGISTRY)) {
    problems.push(`${path}: resolved from ${entry.resolved ?? "(nowhere)"}`);
  }

  if (!entry.integrity?.startsWith("sha512-")) {
    problems.push(`${path}: missing sha512 integrity`);
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  `${lockPath} OK: every package comes from ${REGISTRY} with a sha512 integrity.`,
);
