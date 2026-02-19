// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disabling this allows us to stream the body for files/images
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  
  const backend = process.env.BACKEND_URL;

  if (!backend) {
    return res.status(502).json({ 
      error: 'Proxy Configuration Error', 
      message: 'BACKEND_URL is not set on the server.' 
    });
  }
  
  // Build URL with proper slash handling
  const targetUrl = new URL(`${backend.replace(/\/$/, '')}/${pathString}`);
  console.log("Proxying to:", targetUrl.toString());
  
  // Forward query parameters
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && value) {
      targetUrl.searchParams.append(key, Array.isArray(value) ? value[0] : value);
    }
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        // Forward most headers, but let fetch/node set the host/length
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const contentType = response.headers.get('content-type');
    
    // Relay the status code
    res.status(response.status);

    // Smart response handling
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      // For images, PDFs, or plain text
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed', details: String(error) });
  }
}

async function getRawBody(req: NextApiRequest) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}