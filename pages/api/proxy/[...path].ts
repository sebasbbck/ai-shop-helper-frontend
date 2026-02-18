// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  const targetUrl = process.env.BACKEND_URL + pathString;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward any necessary auth headers here if needed
      },
      // Only include body for non-GET requests
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to proxy request' });
  }
}