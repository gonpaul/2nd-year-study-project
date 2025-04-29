import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
        // Electron-specific globals
        electron: "readonly"
      } 
    },
    rules: {
      // Rules specific to Electron development
      "no-unused-vars": "warn",
      // "import/no-extraneous-dependencies": ["error", { "devDependencies": true }]
    }
  },
  // Main process files (typically in backend)
  {
    files: ["backend/**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    rules: {
      // Rules specific to Electron main process
      // "node/no-deprecated-api": "warn"
    }
  },
  // Renderer process files (typically in frontend)
  {
    files: ["frontend/**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Rules specific to Electron renderer process
    }
  },
  {
		// Note: there should be no other properties in this object
		ignores: ["node_modules/*", "dist/*", "db/*"],
	},
]);