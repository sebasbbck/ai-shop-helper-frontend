import { defineConfig } from 'orval';

const toCamelCase = (str: string) => 
  str.toLowerCase().replace(/[-_ ](\w)/g, (_, c) => c.toUpperCase());

export default defineConfig({
  ai_shop_helper: {
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
        operationName: (operation, _route, _verb) => {
          // Use the summary if it exists (e.g., "Read Item" -> "readItem")
          // Otherwise, grab the first part of the operationId before the underscores
          const name = operation.summary || operation.operationId?.split('__')[0] || 'api';
          return toCamelCase(name);
        },
        transformer: (input) => {
          if (input.pathRoute) {
            Object.values(input.pathRoute).forEach((path) => {
              Object.values(path).forEach((operation: any) => {
                if (operation.responses) {
                  Object.values(operation.responses).forEach((res: any) => {
                    const schema = res.content?.['application/json']?.schema;
                    // FastAPI puts "Response Read Item..." in the title. Let's simplify.
                    if (schema && schema.title) {
                      schema.title = schema.title.replace(/Response /g, '').replace(/Get|Post|Put|Delete/g, '');
                    }
                  });
                }
              });
            });
          }
          return input;
        },
      },
    },
    input: {
      target: './openapi.json',
    },
  },
});