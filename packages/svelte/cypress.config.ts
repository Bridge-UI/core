// ** External Imports
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "cypress";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
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
      framework: "svelte",
      viteConfig: {
        plugins: [svelte(), tailwindcss()],
        cacheDir: resolve(__dirname, ".cache/vite-cypress"),
        resolve: {
          alias: {
            "@": resolve(__dirname, "src"),
          },
        },
      },
    },
  },
});
