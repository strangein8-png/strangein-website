import { NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/blogsStore';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// GET /api/blogs?category=Travel
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const blogs = await getBlogs({ category });
    return NextResponse.json({ blogs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 });
  }
}

// POST /api/blogs  (protected — requires x-admin-key header)
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const blog = await createBlog(body);
    return NextResponse.json({ blog }, { status: 201 });
  } catch (err) {
    const status = err.status || 500;
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Failed to create blog' },
      { status }
    );
  }
}