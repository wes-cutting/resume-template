import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.{ts,tsx}"],
    environmentMatchGlobs: [
      ["tests/integration/**", "jsdom"],
      ["tests/unit/**", "node"],
    ],
    setupFiles: ["./tests/setup.ts"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
