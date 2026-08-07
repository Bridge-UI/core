// ** External Imports
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "cypress";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  allowCypressEnv: false,
  component: {
    specPattern: "src/**/*.cy.tsx",
    // Dual calendar + time layouts need more than Cypress's default 500px width.
    viewportWidth: 1280,
    viewportHeight: 720,
    devServer: {
      bundler: "vite",
      framework: "react",
      viteConfig: {
        plugins: [react(), tailwindcss()],
        cacheDir: resolve(__dirname, ".cache/vite-cypress"),
        resolve: {
          alias: {
            "@": resolve(__dirname, "src"),
            "@examples": resolve(__dirname, "docs/examples"),
          },
        },
      },
    },
  },
});
