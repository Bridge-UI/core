// ** External Imports
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@core": resolve(__dirname, "src") },
  },
  test: {
    name: "core",
    root: __dirname,
    include: ["src/**/*.test.ts"],
  },
});
