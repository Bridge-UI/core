// ** External Imports
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "cypress";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  component: {
    devServer: {
      bundler: "vite",
      framework: "react",
      viteConfig: {
        plugins: [react(), tailwindcss()],
        cacheDir: resolve(__dirname, ".cache/vite-cypress"),
        resolve: {
          alias: { "@": resolve(__dirname, "src") },
        },
      },
    },
    specPattern: "src/**/*.cy.tsx",
  },
});
