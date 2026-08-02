// ** External Imports
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@examples": resolve(__dirname, "../../examples"),
    },
  },
  test: {
    name: "vue",
    root: __dirname,
    environment: "happy-dom",
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],
    include: ["src/**/*.test.ts"],
  },
});
