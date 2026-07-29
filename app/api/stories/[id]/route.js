import { NextResponse } from 'next/server';
import { getStoryById, updateStory, deleteStory } from '@/lib/storiesStore';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// GET /api/stories/:id
export async function GET(_request, { params }) {
  const story = await getStoryById(params.id);
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ story });
}

// PUT /api/stories/:id  (protected)
export async function PUT(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const story = await updateStory(params.id, body);
    if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ story });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

// DELETE /api/stories/:id  (protected)
export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const ok = await deleteStory(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}