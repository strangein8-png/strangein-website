import { NextResponse } from 'next/server';
import { likeStory } from '@/lib/storiesStore';

// POST /api/stories/:id/like — public, bumps the like counter by 1.
export async function POST(_request, { params }) {
  const story = await likeStory(params.id);
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ story });
}