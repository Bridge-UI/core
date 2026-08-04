#!/usr/bin/env node
/**
 * Install Bridge UI agent guidelines/skills into a consumer app.
 *
 * Usage:
 *   npx bridge-ui-vue-ai install
 *   npx bridge-ui-vue-ai install --copy
 *   npx bridge-ui-vue-ai remove
 */

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
const packageName = pkg.name;
const aiRoot = join(packageRoot, "ai");
const binName = Object.keys(pkg.bin ?? {})[0] ?? "bridge-ui-ai";

const MARK_START = "<!-- bridge-ui-ai:start -->";
const MARK_END = "<!-- bridge-ui-ai:end -->";

function printHelp() {
  console.log(`Usage: ${binName} <command> [options]

Commands:
  install   Link (or copy) AI guidelines and skills into the current app
  remove    Remove links/copies created by install
  help      Show this help

Options:
  --copy    Copy files instead of symlinking (Windows / PnP fallback)
  --cwd     App root (default: process.cwd())
`);
}

function parseArgs(argv) {
  const args = { command: "help", copy: false, cwd: process.cwd() };
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--copy") args.copy = true;
    else if (a === "--cwd") args.cwd = resolve(argv[++i] ?? process.cwd());
    else if (a === "-h" || a === "--help") args.command = "help";
    else rest.push(a);
  }

  if (rest[0]) args.command = rest[0];
  return args;
}

function assertAiPresent() {
  if (!existsSync(aiRoot)) {
    console.error(`Missing AI resources in ${packageName}: expected ${aiRoot}`);
    process.exit(1);
  }
}

function skillNames() {
  const skillsDir = join(aiRoot, "skills");
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

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

function linkOrCopy(target, dest, { copy }) {
  mkdirSync(dirname(dest), { recursive: true });
  removePath(dest);

  if (copy) {
    cpSync(target, dest, { recursive: true });
    return "copied";
  }

  try {
    symlinkSync(target, dest, linkTypeFor(target));
    return "linked";
  } catch (err) {
    console.warn(`Symlink failed (${err.message}); falling back to copy.`);
    cpSync(target, dest, { recursive: true });
    return "copied";
  }
}

function resolvesToPackageAi(path, fileName) {
  if (!pathExists(path)) return false;
  try {
    const real = realpathSync(path);
    return real === join(aiRoot, fileName) || real.startsWith(aiRoot + "/");
  } catch {
    return false;
  }
}

function agentsSnippet(skills) {
  const skillList = skills.map((s) => `- \`.cursor/skills/${s}\``).join("\n");
  return `${MARK_START}
## Bridge UI

This app uses **${packageName}**. Full agent guide: \`.ai/AGENTS.md\` (also see \`llms.txt\`).

- Guidelines: \`.ai/guidelines/core.md\`
- Skills (on demand):
${skillList}

Install/update: \`npx ${binName} install\`
${MARK_END}
`;
}

function upsertAgentsMd(appRoot, skills) {
  const path = join(appRoot, "AGENTS.md");
  const snippet = agentsSnippet(skills);
  let next;

  if (!existsSync(path)) {
    next = `# Agent instructions\n\n${snippet}\n`;
  } else {
    const prev = readFileSync(path, "utf8");
    if (prev.includes(MARK_START) && prev.includes(MARK_END)) {
      next = prev.replace(
        new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`, "m"),
        snippet.trimEnd(),
      );
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

  if (resolvesToPackageAi(path, "AGENTS.md") || lstatSync(path).isSymbolicLink()) {
    if (resolvesToPackageAi(path, "AGENTS.md")) {
      removePath(path);
      return path;
    }
  }

  if (!existsSync(path)) return null;
  const prev = readFileSync(path, "utf8");
  if (!prev.includes(MARK_START)) return null;
  const next = prev
    .replace(new RegExp(`\\n*${MARK_START}[\\s\\S]*?${MARK_END}\\n*`, "m"), "\n")
    .trimEnd();
  if (!next.trim()) {
    rmSync(path, { force: true });
    return path;
  }
  writeFileSync(path, `${next}\n`);
  return path;
}

function installRootAgents(appRoot, skills, { copy }) {
  const src = join(aiRoot, "AGENTS.md");
  const dest = join(appRoot, "AGENTS.md");

  if (!existsSync(src)) {
    return { dest: relative(appRoot, dest), mode: upsertAgentsMd(appRoot, skills) && "updated" };
  }

  // Fresh app or previous Bridge-only link → use package AGENTS.md as root file.
  if (!pathExists(dest) || resolvesToPackageAi(dest, "AGENTS.md")) {
    return {
      dest: relative(appRoot, dest),
      mode: linkOrCopy(src, dest, { copy }),
    };
  }

  // App already has its own AGENTS.md → keep it and inject a pointer block.
  upsertAgentsMd(appRoot, skills);
  return { dest: relative(appRoot, dest), mode: "updated" };
}

function install({ cwd: appRoot, copy }) {
  assertAiPresent();
  const skills = skillNames();
  const results = [];

  const agentsSrc = join(aiRoot, "AGENTS.md");
  if (existsSync(agentsSrc)) {
    results.push({
      dest: ".ai/AGENTS.md",
      mode: linkOrCopy(agentsSrc, join(appRoot, ".ai", "AGENTS.md"), { copy }),
    });
  }

  const llmsSrc = join(aiRoot, "llms.txt");
  if (existsSync(llmsSrc)) {
    results.push({
      dest: "llms.txt",
      mode: linkOrCopy(llmsSrc, join(appRoot, "llms.txt"), { copy }),
    });
  }

  const guidelinesSrc = join(aiRoot, "guidelines");
  if (existsSync(guidelinesSrc)) {
    const dest = join(appRoot, ".ai", "guidelines");
    results.push({
      dest: relative(appRoot, dest),
      mode: linkOrCopy(guidelinesSrc, dest, { copy }),
    });
  }

  for (const name of skills) {
    const src = join(aiRoot, "skills", name);
    const dest = join(appRoot, ".cursor", "skills", name);
    results.push({
      dest: relative(appRoot, dest),
      mode: linkOrCopy(src, dest, { copy }),
    });
  }

  results.push(installRootAgents(appRoot, skills, { copy }));

  console.log(`Installed Bridge UI AI resources from ${packageName}`);
  for (const r of results) {
    console.log(`  ${String(r.mode).padEnd(7)} ${r.dest}`);
  }
  console.log(`\nPackage AI root: ${aiRoot}`);
  try {
    console.log(`Resolved: ${realpathSync(aiRoot)}`);
  } catch {
    /* ignore */
  }
}

function remove({ cwd: appRoot }) {
  const skills = skillNames();
  const removed = [];

  for (const rel of [".ai/AGENTS.md", "llms.txt", ".ai/guidelines"]) {
    const dest = join(appRoot, rel);
    if (pathExists(dest)) {
      removePath(dest);
      removed.push(rel);
    }
  }

  for (const name of skills) {
    const dest = join(appRoot, ".cursor", "skills", name);
    if (pathExists(dest)) {
      removePath(dest);
      removed.push(relative(appRoot, dest));
    }
  }

  const agents = stripAgentsMd(appRoot);
  console.log(`Removed Bridge UI AI resources for ${packageName}`);
  for (const p of removed) console.log(`  removed ${p}`);
  if (agents) console.log(`  cleaned ${relative(appRoot, agents)}`);
}

const args = parseArgs(process.argv.slice(2));

switch (args.command) {
  case "install":
    install(args);
    break;
  case "remove":
    remove(args);
    break;
  case "help":
  default:
    printHelp();
    if (args.command !== "help") process.exitCode = 1;
    break;
}
