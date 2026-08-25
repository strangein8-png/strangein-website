import { NextResponse } from 'next/server';
import { likeEvent } from '@/lib/eventsApi';

export async function POST(_request, { params }) {
  try {
    const event = await likeEvent(params.id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to like event' }, { status: err.status || 500 });
  }
}