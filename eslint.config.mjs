import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import globals from "globals"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import { defineConfig } from "eslint/config"

export default defineConfig(
  {
    ignores: ["dist/", "node_modules/", "eslint.config.mjs"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-console": "error",
    },
  },
)
