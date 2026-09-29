// import { NextResponse } from 'next/server';
// import { getEvents, createEvent } from '@/lib/eventsApi';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const upcoming = searchParams.get('upcoming');
//   try {
//     const events = await getEvents({ upcoming });
//     return NextResponse.json({ events });
//   } catch (err) {
//     return NextResponse.json({ error: 'Failed to load events' }, { status: err.status || 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const event = await createEvent(body);
//     return NextResponse.json({ event }, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: err.status || 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/eventsApi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const result = await getEvents({
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      trendingOnly: searchParams.get('trendingOnly') || undefined,
      liveOnly: searchParams.get('liveOnly') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      upcoming: searchParams.get('upcoming') || undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to load events' },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request) {
  if (request.headers.get('x-admin-key') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const event = await createEvent(body);
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to create event' },
      { status: err.status || 500 }
    );
  }
}