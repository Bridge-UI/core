#!/usr/bin/env node
/**
 * Install Bridge UI agent guidelines, docs, and skills into a consumer app.
 *
 * Usage:
 *   npx bridge-ui-vue-ai install|remove [--copy] [--cwd <dir>]
 */

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Package context
// ---------------------------------------------------------------------------

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

const packageName = pkg.name;
const aiRoot = join(packageRoot, "ai");
const docsRoot = join(packageRoot, "docs");
const binName = Object.keys(pkg.bin ?? {})[0] ?? "bridge-ui-ai";

const MARK_END = "<!-- bridge-ui-ai:end -->";
const MARK_START = "<!-- bridge-ui-ai:start -->";
const MARK_BLOCK = new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`, "m");
const MARK_BLOCK_PADDED = new RegExp(
  `\\n*${MARK_START}[\\s\\S]*?${MARK_END}\\n*`,
  "m",
);

/** Paths linked/copied into the consumer app (relative dest → absolute source). */
function installTargets() {
  return [
    { dest: ".ai/docs", src: docsRoot },
    { dest: "llms.txt", src: join(aiRoot, "llms.txt") },
    { dest: ".ai/AGENTS.md", src: join(aiRoot, "AGENTS.md") },
    { dest: ".ai/guidelines", src: join(aiRoot, "guidelines") },
  ].filter(({ src }) => existsSync(src));
}

function skillTargets() {
  const skillsDir = join(aiRoot, "skills");

  if (!existsSync(skillsDir)) return [];

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => ({
      dest: join(".cursor", "skills", name),
      src: join(skillsDir, name),
    }));
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`Usage: ${binName} <command> [options]

Commands:
  install   Link (or copy) AI guidelines, docs, and skills into the app
  remove    Remove links/copies created by install
  help      Show this help

Options:
  --copy    Copy files instead of symlinking (Windows / PnP fallback)
  --cwd     App root (default: process.cwd())
`);
}

function parseArgs(argv) {
  const args = { command: "help", copy: false, cwd: process.cwd() };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--copy") {
      args.copy = true;
    } else if (arg === "--cwd") {
      args.cwd = resolve(argv[++i] ?? process.cwd());
    } else if (arg === "-h" || arg === "--help") {
      args.command = "help";
    } else if (!arg.startsWith("-") && args.command === "help") {
      args.command = arg;
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function removePath(path) {
  if (!pathExists(path)) return;

  rmSync(path, { recursive: true, force: true });
}

function linkTypeFor(target) {
  if (lstatSync(target).isDirectory()) {
    return process.platform === "win32" ? "junction" : "dir";
  }

  return "file";
}

/** @returns {"linked" | "copied"} */
function linkOrCopy(target, dest, { copy }) {
  mkdirSync(dirname(dest), { recursive: true });
  removePath(dest);

  if (!copy) {
    try {
      symlinkSync(target, dest, linkTypeFor(target));
      return "linked";
    } catch (err) {
      console.warn(`Symlink failed (${err.message}); falling back to copy.`);
    }
  }

  cpSync(target, dest, { recursive: true });

  return "copied";
}

function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

function resolvesUnder(path, root, fileName) {
  if (!pathExists(path)) return false;
  try {
    const real = realpathSync(path);

    return real === join(root, fileName) || real.startsWith(`${root}/`);
  } catch {
    return false;
  }
}

/** True when `path` is a real file whose contents match the package AGENTS.md. */
function isPackageAgentsCopy(path) {
  const src = join(aiRoot, "AGENTS.md");

  if (!existsSync(src) || !existsSync(path) || isSymlink(path)) {
    return false;
  }

  try {
    return readFileSync(path, "utf8") === readFileSync(src, "utf8");
  } catch {
    return false;
  }
}

function removeEmptyDir(path) {
  try {
    rmdirSync(path);
    return true;
  } catch {
    return false;
  }
}

function cleanupEmptyDirs(appRoot) {
  const cleaned = [];

  for (const rel of [".ai", join(".cursor", "skills"), ".cursor"]) {
    if (removeEmptyDir(join(appRoot, rel))) {
      cleaned.push(rel.replaceAll("\\", "/"));
    }
  }

  return cleaned;
}

function assertAiPresent() {
  if (existsSync(aiRoot)) return;
  console.error(`Missing AI resources in ${packageName}: expected ${aiRoot}`);

  process.exit(1);
}

function logResults(title, results) {
  console.log(title);

  for (const { mode, dest } of results) {
    console.log(`  ${String(mode).padEnd(7)} ${dest}`);
  }
}

// ---------------------------------------------------------------------------
// AGENTS.md / CLAUDE.md
// ---------------------------------------------------------------------------

function agentsSnippet(skills) {
  const skillList = skills
    .map(({ dest }) => `- \`${dest.replaceAll("\\", "/")}\``)
    .join("\n");

  return `${MARK_START}
## Bridge UI

This app uses **${packageName}**. Full agent guide: \`.ai/AGENTS.md\` (also see \`llms.txt\`).

- Docs: \`.ai/docs/\` (component API and examples)
- Guidelines: \`.ai/guidelines/core.md\`
- Skills (on demand):
${skillList}

Install/update: \`npx ${binName} install\`
${MARK_END}
`;
}

function upsertAgentsMd(appRoot, skills) {
  let next;
  const snippet = agentsSnippet(skills);
  const path = join(appRoot, "AGENTS.md");

  // Never write through a symlink (would mutate package sources under file: installs).
  if (isSymlink(path)) {
    removePath(path);
  }

  if (!existsSync(path)) {
    // Stub only — strip on remove deletes the file cleanly.
    next = `${snippet.trimEnd()}\n`;
  } else {
    const prev = readFileSync(path, "utf8");

    if (prev.includes(MARK_START) && prev.includes(MARK_END)) {
      next = prev.replace(MARK_BLOCK, snippet.trimEnd());
    } else {
      next = `${prev.trimEnd()}\n\n${snippet}\n`;
    }
  }

  writeFileSync(path, next.endsWith("\n") ? next : `${next}\n`);
  return path;
}

function stripAgentsMd(appRoot) {
  const path = join(appRoot, "AGENTS.md");

  if (!pathExists(path)) return null;

  // Legacy installs that linked/copied the full package guide to the root.
  if (isPackageAgentsCopy(path) || resolvesUnder(path, aiRoot, "AGENTS.md")) {
    removePath(path);
    return path;
  }

  if (!existsSync(path)) return null;

  const prev = readFileSync(path, "utf8");

  if (!prev.includes(MARK_START)) return null;

  const next = prev.replace(MARK_BLOCK_PADDED, "\n").trimEnd();

  if (!next.trim()) {
    rmSync(path, { force: true });
    return path;
  }

  writeFileSync(path, `${next}\n`);

  return path;
}

/**
 * Root AGENTS.md is always a short stub (or inject into the app's own file).
 * Full guide lives at `.ai/AGENTS.md` only.
 */
function installRootAgents(appRoot, skills) {
  const dest = join(appRoot, "AGENTS.md");
  const rel = relative(appRoot, dest);

  // Legacy full-guide link/copy or foreign Bridge symlink → replace with stub.
  if (
    isSymlink(dest) ||
    isPackageAgentsCopy(dest) ||
    resolvesUnder(dest, aiRoot, "AGENTS.md")
  ) {
    removePath(dest);
  }

  upsertAgentsMd(appRoot, skills);

  return { dest: rel, mode: "updated" };
}

/** True when CLAUDE.md is our symlink/copy of the root AGENTS.md stub. */
function isClaudeBridgeManaged(appRoot, claudePath) {
  const agents = join(appRoot, "AGENTS.md");

  if (!pathExists(claudePath) || !pathExists(agents)) return false;

  if (isSymlink(claudePath)) {
    try {
      return realpathSync(claudePath) === realpathSync(agents);
    } catch {
      try {
        const target = readlinkSync(claudePath);

        return resolve(dirname(claudePath), target) === agents;
      } catch {
        return false;
      }
    }
  }

  try {
    return readFileSync(claudePath, "utf8") === readFileSync(agents, "utf8");
  } catch {
    return false;
  }
}

function installClaudeMd(appRoot, { copy }) {
  const dest = join(appRoot, "CLAUDE.md");
  const agents = join(appRoot, "AGENTS.md");

  if (!existsSync(agents)) return null;

  // App already has its own CLAUDE.md → leave it alone.
  if (pathExists(dest) && !isClaudeBridgeManaged(appRoot, dest)) {
    return null;
  }

  return {
    dest: "CLAUDE.md",
    mode: linkOrCopy(agents, dest, { copy }),
  };
}

function stripClaudeMd(appRoot) {
  const path = join(appRoot, "CLAUDE.md");

  if (!isClaudeBridgeManaged(appRoot, path)) return null;

  removePath(path);
  return path;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function install({ cwd: appRoot, copy }) {
  assertAiPresent();

  const results = [];
  const skills = skillTargets();

  for (const { src, dest } of [...installTargets(), ...skills]) {
    results.push({
      dest,
      mode: linkOrCopy(src, join(appRoot, dest), { copy }),
    });
  }

  results.push(installRootAgents(appRoot, skills));

  const claude = installClaudeMd(appRoot, { copy });

  if (claude) results.push(claude);

  logResults(`Installed Bridge UI AI resources from ${packageName}`, results);

  console.log(`\nPackage AI root: ${aiRoot}`);

  try {
    console.log(`Resolved: ${realpathSync(aiRoot)}`);
  } catch {
    /* ignore */
  }
}

function remove({ cwd: appRoot }) {
  const removed = [];

  for (const { dest } of [...installTargets(), ...skillTargets()]) {
    const absolute = join(appRoot, dest);

    if (!pathExists(absolute)) continue;

    removePath(absolute);
    removed.push(dest);
  }

  // CLAUDE before AGENTS so content/realpath checks still resolve.
  const claude = stripClaudeMd(appRoot);
  const agents = stripAgentsMd(appRoot);
  const emptyDirs = cleanupEmptyDirs(appRoot);

  console.log(`Removed Bridge UI AI resources for ${packageName}`);

  for (const path of removed) {
    console.log(`  removed ${path}`);
  }

  if (claude) {
    console.log(`  cleaned ${relative(appRoot, claude)}`);
  }

  if (agents) {
    console.log(`  cleaned ${relative(appRoot, agents)}`);
  }

  for (const dir of emptyDirs) {
    console.log(`  removed ${dir}/`);
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));

switch (args.command) {
  case "install":
    install(args);
    break;
  case "remove":
    remove(args);
    break;
  case "help":
    printHelp();
    break;
  default:
    printHelp();
    process.exitCode = 1;
}
