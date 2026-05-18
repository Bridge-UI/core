// ** External Imports
import vue from "@vitejs/plugin-vue";
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
        walk(path);
        continue;
      }

      if (name !== "index.ts") {
        continue;
      }

      const rel = relative(dir, path).replace(/\.ts$/, "");

      if (rel === "index") {
        continue;
      }

      entries[rel.replaceAll("\\", "/")] = path;
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
    vue(),
    dts({
      entryRoot: srcDir,
      tsconfigPath: "./tsconfig.json",
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
      external: [
        "vue",
        "clsx",
        /^es-toolkit/,
        "tailwind-merge",
        "lucide-vue-next",
        /^@bridge-ui\/core/,
      ],
      preserveEntrySignatures: "strict",
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
