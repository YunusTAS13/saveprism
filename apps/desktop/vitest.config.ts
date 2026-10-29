import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The on-disk module cache keeps old `import.meta.glob` results, so a newly added language
    // file would go untested.
    fsModuleCache: false,
  },
});
