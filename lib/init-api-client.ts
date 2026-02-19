// Initialize API client to use the proxy endpoint
import { client } from '../api/client.gen';

// On the browser, always route through the proxy
// The proxy uses BACKEND_URL on the server
client.setConfig({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy',
});

export { client };
