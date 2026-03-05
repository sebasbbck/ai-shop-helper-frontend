import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false, // Disabling this allows us to stream the body for files/images
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path } = req.query
  const pathString = Array.isArray(path) ? path.join('/') : path || ''
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backend) {
    return res.status(502).json({ error: 'Proxy Configuration Error' })
  }

  const targetUrl = new URL(`${backend.replace(/\/$/, '')}/${pathString}`)

  // Forward query parameters
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && value) {
      targetUrl.searchParams.append(
        key,
        Array.isArray(value) ? value[0] : value,
      )
    }
  })

  try {
    // Get the raw body from the stream
    let requestBody: Buffer | undefined = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      requestBody = await getRawBody(req)
    }

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        // Forward the content-type so the backend knows how to parse the buffer
        'Content-Type': req.headers['content-type'] || 'application/json',
        Authorization: req.headers['authorization'] || '',
      },
      // Send the actual buffer
      body: requestBody as BodyInit | undefined,
    })

    const contentType = response.headers.get('content-type')
    res.status(response.status)

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      res.json(data)
    } else {
      const buffer = await response.arrayBuffer()
      res.send(Buffer.from(buffer))
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy failed', details: String(error) })
  }
}

async function getRawBody(req: NextApiRequest) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}
