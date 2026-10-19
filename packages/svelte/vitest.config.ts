// ** External Imports
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    name: "svelte",
    root: __dirname,
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],
  },
});
