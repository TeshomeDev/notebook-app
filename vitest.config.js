import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    clearMocks: true,
    include: [
      "src/**/*.test.js",
      "tests/integration/**/*.test.js"
    ],
    exclude: [
      "node_modules",
      "tests/e2e/**"
    ]
  },
});
