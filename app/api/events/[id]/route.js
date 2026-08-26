import { NextResponse } from 'next/server';
import { getEventById, updateEvent, deleteEvent } from '@/lib/eventsApi';

export async function GET(_request, { params }) {
  try {
    const event = await getEventById(params.id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load event' }, { status: err.status || 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const event = await updateEvent(params.id, body);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to update event' }, { status: err.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const ok = await deleteEvent(params.id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to delete event' }, { status: err.status || 500 });
  }
}