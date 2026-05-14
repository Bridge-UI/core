// ** External Imports
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    lib: { entry: resolve(__dirname, "src/index.ts"), formats: ["es"] },
    rollupOptions: {
      external: [
        "vue",
        "clsx",
        /^es-toolkit/,
        "tailwind-merge",
        "lucide-vue-next",
        /^@bridge-ui\/core/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
