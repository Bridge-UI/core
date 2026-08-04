// @vitest-environment node

// ** External Imports
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, test } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageRoot = resolve(__dirname, "../..");
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

const aiRoot = join(packageRoot, "ai");
const packageName = pkg.name as string;
const binPath = join(packageRoot, "bin", "ai.mjs");
const binName = Object.keys(pkg.bin ?? {})[0] as string;

const MARK_END = "<!-- bridge-ui-ai:end -->";
const MARK_START = "<!-- bridge-ui-ai:start -->";

const skillNames = [
  "bridge-ui-forms",
  "bridge-ui-setup",
  "bridge-ui-overlays",
  "bridge-ui-components",
] as const;

const installedRels = [
  ".ai/docs",
  "llms.txt",
  ".ai/AGENTS.md",
  ".ai/guidelines",
  ...skillNames.map((name) => join(".cursor", "skills", name)),
] as const;

let appRoot: string;

function createAppRoot() {
  appRoot = mkdtempSync(join(tmpdir(), "bridge-ui-ai-"));
  return appRoot;
}

function run(args: string[]) {
  return spawnSync(process.execPath, [binPath, ...args], {
    encoding: "utf8",
    env: process.env,
  });
}

function isSymlink(path: string) {
  return lstatSync(path).isSymbolicLink();
}

afterEach(() => {
  if (appRoot && existsSync(appRoot)) {
    rmSync(appRoot, { recursive: true, force: true });
  }
});

describe("bridge-ui-ai CLI", () => {
  test("it should print help for help and --help", () => {
    for (const args of [["help"], ["--help"], ["-h"], []]) {
      const result = run(args);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("install");
      expect(result.stdout).toContain("remove");
      expect(result.stdout).toContain(`Usage: ${binName}`);
    }
  });

  test("it should exit with code 1 for unknown commands", () => {
    const result = run(["nope"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain(`Usage: ${binName}`);
  });

  test("it should symlink AI resources and write a root AGENTS.md stub", () => {
    const cwd = createAppRoot();
    const result = run(["install", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      `Installed Bridge UI AI resources from ${packageName}`,
    );

    for (const rel of installedRels) {
      const dest = join(cwd, rel);

      expect(isSymlink(dest), rel).toBe(true);
      expect(existsSync(dest), rel).toBe(true);
    }

    const agents = join(cwd, "AGENTS.md");
    const content = readFileSync(agents, "utf8");

    expect(isSymlink(agents)).toBe(false);
    expect(content).toContain(MARK_START);
    expect(content).toContain(MARK_END);
    expect(content).toContain(packageName);
    expect(content).toContain(".ai/AGENTS.md");
    expect(content).not.toBe(readFileSync(join(aiRoot, "AGENTS.md"), "utf8"));
    expect(realpathSync(join(cwd, ".ai", "AGENTS.md"))).toBe(
      realpathSync(join(aiRoot, "AGENTS.md")),
    );
  });

  test("it should copy AI resources when --copy is set", () => {
    const cwd = createAppRoot();

    const result = run(["install", "--copy", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/copied\s+\.ai\/AGENTS\.md/);

    for (const rel of installedRels) {
      const dest = join(cwd, rel);

      expect(isSymlink(dest), rel).toBe(false);
      expect(existsSync(dest), rel).toBe(true);
    }

    const agents = join(cwd, "AGENTS.md");

    expect(isSymlink(agents)).toBe(false);
    expect(readFileSync(agents, "utf8")).toContain(MARK_START);
    expect(readFileSync(agents, "utf8")).not.toBe(
      readFileSync(join(aiRoot, "AGENTS.md"), "utf8"),
    );
  });

  test("it should inject a Bridge block when AGENTS.md already exists", () => {
    const cwd = createAppRoot();

    const agentsPath = join(cwd, "AGENTS.md");

    writeFileSync(agentsPath, "# My app agents\n\nKeep me.\n");

    const result = run(["install", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/updated\s+AGENTS\.md/);

    const content = readFileSync(agentsPath, "utf8");

    expect(content).toContain(MARK_END);
    expect(content).toContain("Keep me.");
    expect(content).toContain(MARK_START);
    expect(content).toContain(packageName);
    expect(isSymlink(agentsPath)).toBe(false);
    expect(content).toContain("# My app agents");
    expect(content).toContain(`npx ${binName} install`);
  });

  test("it should replace an existing Bridge block on reinstall", () => {
    const cwd = createAppRoot();

    const agentsPath = join(cwd, "AGENTS.md");

    writeFileSync(
      agentsPath,
      [
        "# My app agents",
        "",
        MARK_START,
        "stale block",
        MARK_END,
        "",
        "After block.",
        "",
      ].join("\n"),
    );

    const result = run(["install", "--cwd", cwd]);

    expect(result.status).toBe(0);

    const content = readFileSync(agentsPath, "utf8");

    expect(content).toContain("After block.");
    expect(content).toContain("## Bridge UI");
    expect(content).toContain("# My app agents");
    expect(content).not.toContain("stale block");
  });

  test("it should remove linked resources, root stub, and empty dirs", () => {
    const cwd = createAppRoot();

    expect(run(["install", "--cwd", cwd]).status).toBe(0);

    const result = run(["remove", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      `Removed Bridge UI AI resources for ${packageName}`,
    );

    for (const rel of installedRels) {
      expect(existsSync(join(cwd, rel)), rel).toBe(false);
    }

    expect(existsSync(join(cwd, "AGENTS.md"))).toBe(false);
    expect(existsSync(join(cwd, "CLAUDE.md"))).toBe(false);
    expect(existsSync(join(cwd, ".ai"))).toBe(false);
    expect(existsSync(join(cwd, ".cursor"))).toBe(false);
  });

  test("it should strip the Bridge block and keep custom AGENTS.md content", () => {
    const cwd = createAppRoot();

    const agentsPath = join(cwd, "AGENTS.md");

    writeFileSync(agentsPath, "# My app agents\n\nKeep me.\n");

    expect(run(["install", "--cwd", cwd]).status).toBe(0);
    expect(run(["remove", "--cwd", cwd]).status).toBe(0);

    expect(existsSync(agentsPath)).toBe(true);

    const content = readFileSync(agentsPath, "utf8");

    expect(content).toContain("Keep me.");
    expect(content).toContain("# My app agents");
    expect(content).not.toContain(MARK_END);
    expect(content).not.toContain(MARK_START);
  });

  test("it should recreate parent dirs when installing over a previous install", () => {
    const cwd = createAppRoot();

    expect(run(["install", "--cwd", cwd]).status).toBe(0);
    expect(run(["remove", "--cwd", cwd]).status).toBe(0);

    mkdirSync(join(cwd, ".ai"), { recursive: true });
    mkdirSync(join(cwd, ".cursor", "skills"), { recursive: true });

    const result = run(["install", "--copy", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(existsSync(join(cwd, ".ai", "guidelines", "core.md"))).toBe(true);
    expect(
      existsSync(join(cwd, ".cursor", "skills", "bridge-ui-setup", "SKILL.md")),
    ).toBe(true);
  });

  test("it should remove AGENTS.md after install --copy", () => {
    const cwd = createAppRoot();

    expect(run(["install", "--copy", "--cwd", cwd]).status).toBe(0);
    expect(existsSync(join(cwd, "AGENTS.md"))).toBe(true);

    expect(run(["remove", "--cwd", cwd]).status).toBe(0);
    expect(existsSync(join(cwd, "AGENTS.md"))).toBe(false);
  });

  test("it should link CLAUDE.md to the root stub and remove it on uninstall", () => {
    const cwd = createAppRoot();

    expect(run(["install", "--cwd", cwd]).status).toBe(0);

    const claude = join(cwd, "CLAUDE.md");
    const agents = join(cwd, "AGENTS.md");

    expect(isSymlink(claude)).toBe(true);
    expect(realpathSync(claude)).toBe(realpathSync(agents));

    expect(run(["remove", "--cwd", cwd]).status).toBe(0);
    expect(existsSync(claude)).toBe(false);
  });

  test("it should not overwrite a custom CLAUDE.md", () => {
    const cwd = createAppRoot();
    const claude = join(cwd, "CLAUDE.md");

    writeFileSync(claude, "# My Claude rules\n");

    expect(run(["install", "--cwd", cwd]).status).toBe(0);
    expect(isSymlink(claude)).toBe(false);
    expect(readFileSync(claude, "utf8")).toBe("# My Claude rules\n");

    expect(run(["remove", "--cwd", cwd]).status).toBe(0);
    expect(existsSync(claude)).toBe(true);
    expect(readFileSync(claude, "utf8")).toBe("# My Claude rules\n");
  });

  test("it should not mutate another package AGENTS.md when replacing a foreign symlink", () => {
    const cwd = createAppRoot();

    const otherRoot = resolve(packageRoot, "../vue");
    const otherAgents = join(otherRoot, "ai", "AGENTS.md");
    const before = readFileSync(otherAgents, "utf8");

    symlinkSync(otherAgents, join(cwd, "AGENTS.md"));

    const result = run(["install", "--cwd", cwd]);

    expect(result.status).toBe(0);
    expect(isSymlink(join(cwd, "AGENTS.md"))).toBe(false);
    expect(readFileSync(join(cwd, "AGENTS.md"), "utf8")).toContain(MARK_START);

    expect(readFileSync(otherAgents, "utf8")).toBe(before);
    expect(readFileSync(otherAgents, "utf8")).not.toContain(MARK_START);
    expect(readFileSync(otherAgents, "utf8")).not.toContain(packageName);
  });
});
