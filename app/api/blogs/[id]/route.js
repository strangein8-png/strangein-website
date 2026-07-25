import { NextResponse } from 'next/server';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/blogsStore';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// GET /api/blogs/:id  (id or slug)
export async function GET(_request, { params }) {
  const blog = await getBlogById(params.id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ blog });
}

// PUT /api/blogs/:id  (protected)
export async function PUT(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const blog = await updateBlog(params.id, body);
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ blog });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE /api/blogs/:id  (protected)
export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const ok = await deleteBlog(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}