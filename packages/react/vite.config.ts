// ** External Imports
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [dts({ tsconfigPath: "./tsconfig.json" })],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    lib: { entry: resolve(__dirname, "src/index.ts"), formats: ["es"] },
    rollupOptions: {
      external: [
        "react",
        "clsx",
        "react-dom",
        /^es-toolkit/,
        "lucide-react",
        "tailwind-merge",
        "react/jsx-runtime",
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
