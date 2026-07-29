import { NextResponse } from 'next/server';
import { getStories, createStory } from '@/lib/storiesStore';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// GET /api/stories
export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json({ stories });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 });
  }
}

// POST /api/stories  (protected — requires x-admin-key header)
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const story = await createStory(body);
    return NextResponse.json({ story }, { status: 201 });
  } catch (err) {
    const status = err.status || 500;
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Failed to create story' },
      { status }
    );
  }
}