import { NextResponse } from 'next/server';
import { likeBlog } from '@/lib/blogsStore';

// POST /api/blogs/:id/like — public, bumps the like counter by 1.
export async function POST(_request, { params }) {
  const blog = await likeBlog(params.id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ blog });
}