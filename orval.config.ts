import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    output: {
      httpClient: 'axios',
      mode: 'tags-split',
      target: 'api/endpoints.ts',
      schemas: 'api/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: './api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: './openapi.json',
    },
  },
});