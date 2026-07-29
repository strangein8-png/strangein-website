import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getStore } from '@netlify/blobs';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

// ONE-TIME USE: reads the old data/blogs.json and data/stories.json files
// that are still sitting (read-only) in the deployed bundle, and copies
// their contents into Netlify Blobs. Safe to call more than once — it
// overwrites the blob with whatever's in the bundled JSON files, it
// doesn't append/duplicate.
//
// After you've confirmed your old posts show up again, delete this file
// (or at least stop calling it) — no need to leave a bulk-overwrite
// endpoint lying around.
//
// Usage: POST /api/admin/migrate  with header  x-admin-key: <your key>

async function readBundledJson(relativePath) {
  try {
    const filePath = path.join(process.cwd(), relativePath);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null; // file doesn't exist, that's fine
    throw err;
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const result = { blogs: null, stories: null };

  try {
    const blogs = await readBundledJson('data/blogs.json');
    if (blogs) {
      await getStore('blogs').setJSON('all', blogs);
      result.blogs = `Migrated ${blogs.length} blog(s).`;
    } else {
      result.blogs = 'No data/blogs.json found in deployed bundle — nothing to migrate.';
    }
  } catch (err) {
    console.error('Blog migration failed:', err);
    result.blogs = `Error: ${err.message}`;
  }

  try {
    const stories = await readBundledJson('data/stories.json');
    if (stories) {
      await getStore('stories').setJSON('all', stories);
      result.stories = `Migrated ${stories.length} story(ies).`;
    } else {
      result.stories = 'No data/stories.json found in deployed bundle — nothing to migrate.';
    }
  } catch (err) {
    console.error('Story migration failed:', err);
    result.stories = `Error: ${err.message}`;
  }

  return NextResponse.json(result);
}