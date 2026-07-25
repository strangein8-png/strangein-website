import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// Must run on the Node runtime (not Edge) since we touch the filesystem.
export const runtime = 'nodejs';

// NOTE: like the JSON blog store, this saves files to disk under
// public/uploads/. That works great locally and on a normal Node server
// with persistent storage, but serverless hosts (e.g. Vercel) have a
// read-only filesystem at runtime, so uploads would fail or vanish there.
// For serverless deployment, swap this for a real object store (S3,
// Cloudflare R2, Vercel Blob, etc.) and return that URL instead.

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
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
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name || '') || `.${file.type.split('/')[1]}`;
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}