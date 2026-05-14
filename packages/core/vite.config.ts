// ** External Imports
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const srcDir = resolve(__dirname, "src");

const entries = Object.fromEntries(
  (readdirSync(srcDir, { recursive: true }) as string[])
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => !f.includes("__tests__"))
    .map((f) => [f.replace(/\.ts$/, ""), resolve(srcDir, f)]),
);

export default defineConfig({
  resolve: {
    alias: { "@core": resolve(__dirname, "src") },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(/\{\n\}/g, "{}"),
      }),
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["clsx", /^es-toolkit/, "tailwind-merge"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },
});
