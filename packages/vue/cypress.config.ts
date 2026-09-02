// ** External Imports
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "cypress";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  allowCypressEnv: false,
  component: {
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: "src/**/*.cy.ts",
    retries: {
      runMode: 2,
      openMode: 0,
    },
    devServer: {
      bundler: "vite",
      framework: "vue",
      viteConfig: {
        plugins: [vue(), tailwindcss()],
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
