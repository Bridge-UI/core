// ** External Imports
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const typeSorting = [
  "error",
  {
    order: "asc" as const,
    type: "alphabetical" as const,
  },
];

const unusedVars = [
  "error",
  {
    argsIgnorePattern: "^_",
    varsIgnorePattern: "^_",
  },
];

const objectSorting = [
  "error",
  {
    type: "unsorted" as const,
    useConfigurationIf: {
      callingFunctionNamePattern: "^cn$",
    },
  },
  {
    order: "asc" as const,
    type: "line-length" as const,
  },
];

export default defineConfig(
  {
    ignores: ["**/dist/**", "**/coverage/**", "**/node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["packages/vue/**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: "module",
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["packages/react/**/*.{tsx,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "perfectionist/sort-objects": objectSorting,
      "perfectionist/sort-interfaces": typeSorting,
      "perfectionist/sort-object-types": typeSorting,
      "@typescript-eslint/no-unused-vars": unusedVars,
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  eslintConfigPrettier,
);
