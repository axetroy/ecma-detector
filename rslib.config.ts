import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "src/index.ts",
    },
  },
  lib: [
    {
      format: "esm",
      syntax: "es5",
      output: {
        distPath: {
          js: "dist/esm",
        },
      },
    },
    {
      format: "cjs",
      syntax: "es5",
      output: {
        distPath: {
          js: "dist/cjs",
        },
      },
    },
  ],
  output: {
    target: "web",
  },
});
