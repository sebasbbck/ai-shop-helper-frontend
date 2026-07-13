import { defineConfig } from "vitest/config";


// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
   "exclude": ["**/node_modules/**", "**/dist/**", "**/e2e/**",'**/*.{test,spec}.ts'],

  },
});