import { createClient, createConfig } from '../client/client';
import type { ClientOptions } from '../client/types.gen';

export const wrappedClient = createClient(
  createConfig<ClientOptions>({
    baseUrl: '/api/proxy',
  })
);

export * from '../client/sdk.gen';