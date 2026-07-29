import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

// Images are stored as binary blobs in Netlify Blobs (store: "images"),
// keyed by a generated filename. They're served back out through
// /api/uploads/[filename] (see that route) since we can no longer write
// into public/uploads on a read-only filesystem.

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// POST /api/upload  (protected — requires x-admin-key header)
// Expects multipart/form-data with a field named "image".
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('image');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use JPG, PNG, WEBP, or GIF.' },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
  }

  try {
    const ext = (file.name?.split('.').pop() || file.type.split('/')[1] || 'bin').toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const store = getStore('images');
    await store.set(filename, buffer, {
      metadata: { contentType: file.type },
    });

    return NextResponse.json({ url: `/api/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}