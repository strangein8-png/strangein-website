import { getStore } from '@netlify/blobs';

export const runtime = 'nodejs';

// GET /api/uploads/:filename — serves an image previously saved by
// /api/upload out of the "images" Netlify Blobs store.
export async function GET(_request, { params }) {
  const store = getStore('images');

  const result = await store.getWithMetadata(params.filename, { type: 'arrayBuffer' });

  if (!result) {
    return new Response('Not found', { status: 404 });
  }

  const contentType = result.metadata?.contentType || 'application/octet-stream';

  return new Response(result.data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // Images are content-addressed by random filename, so they never
      // change once uploaded — safe to cache aggressively.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}