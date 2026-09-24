// ** External Imports
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const srcDir = resolve(__dirname, "src");

function collectLibEntries(dir: string) {
  const entries: Record<string, string> = {
    index: resolve(dir, "index.ts"),
  };

  function walk(currentDir: string) {
    for (const name of readdirSync(currentDir)) {
      const path = join(currentDir, name);

      if (statSync(path).isDirectory()) {
        if (name === "__tests__") {
          continue;
        }

        walk(path);
        continue;
      }

      const rel = relative(dir, path).replaceAll("\\", "/");
      const withoutExt = rel.replace(/\.tsx?$/, "");

      if (withoutExt === "index" || rel.includes(".test.")) {
        continue;
      }

      const isIndex = name === "index.ts";
      const isExampleAdapter =
        name.endsWith(".ts") &&
        relative(dir, currentDir).replaceAll("\\", "/") === "Adapters/Examples";

      if (!isIndex && !isExampleAdapter) {
        continue;
      }

      entries[withoutExt] = path;
    }
  }

  walk(dir);

  return entries;
}

export default defineConfig({
  resolve: {
    alias: { "@": srcDir },
  },
  plugins: [
    dts({
      entryRoot: srcDir,
      tsconfigPath: "./tsconfig.json",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(/\{\n\}/g, "{}"),
      }),
    }),
  ],
  build: {
    lib: {
      formats: ["es"],
      entry: collectLibEntries(srcDir),
    },
    rollupOptions: {
      checks: { pluginTimings: false },
      preserveEntrySignatures: "strict",
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
      external: [
        "clsx",
        "luxon",
        "dayjs",
        /^dayjs\//,
        "react",
        "moment",
        "i18next",
        "date-fns",
        "react-dom",
        /^es-toolkit/,
        /^@tiptap\//,
        "lucide-react",
        "tailwind-merge",
        "moment-timezone",
        "react/jsx-runtime",
        /^@bridge-ui\/core/,
        /^@heroicons\/react/,
        "@tabler/icons-react",
        "@tanstack/react-table",
        "@phosphor-icons/react",
        "@fortawesome/react-fontawesome",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
      ],
    },
  },
});
