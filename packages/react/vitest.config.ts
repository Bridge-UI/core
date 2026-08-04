// ** External Imports
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@examples": resolve(__dirname, "examples"),
    },
  },
  test: {
    name: "react",
    root: __dirname,
    environment: "happy-dom",
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
