// ** External Imports
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
        resolve: {
          alias: { "@": resolve(__dirname, "src") },
        },
      },
    },
    specPattern: "src/**/*.cy.tsx",
  },
});
