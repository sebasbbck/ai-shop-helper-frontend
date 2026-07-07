import { defineConfig } from "orval";

export default defineConfig({
  aiShopHelper: {
    input: "./openapi.json",
    output: {
      target: "./src/api/endpoints",
      schemas: "./src/api/model",
      mode: "tags-split",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/api/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
