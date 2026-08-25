import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/eventsApi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get('upcoming');
  try {
    const events = await getEvents({ upcoming });
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load events' }, { status: err.status || 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const event = await createEvent(body);
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: err.status || 500 });
  }
}