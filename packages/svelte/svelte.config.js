// ** External Imports
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath, URL } from "node:url";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig & { alias: Record<string, string> }} */
export default {
  preprocess: vitePreprocess(),
  // Read by `svelte-package`, which rewrites `@/…` imports to relative paths
  // in `dist`. Vite / Vitest / Cypress resolve `@` through `resolve.alias`.
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
};
