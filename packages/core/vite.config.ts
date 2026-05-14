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
    .map((f) => [f.replace(/\.ts$/, ""), resolve(srcDir, f)]),
);

export default defineConfig({
  plugins: [dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@core": resolve(__dirname, "src") },
  },
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
