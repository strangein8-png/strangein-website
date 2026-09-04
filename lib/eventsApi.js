// const BACKEND_URL = process.env.BACKEND_API_URL;
// const ADMIN_KEY = process.env.ADMIN_API_KEY;

// async function backendFetch(path, options = {}) {
//   const res = await fetch(`${BACKEND_URL}${path}`, {
//     ...options,
//     headers: { 'Content-Type': 'application/json', ...options.headers },
//     cache: 'no-store',
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     const message = typeof data.error === 'string' ? data.error : data.message || 'Backend request failed';
//     const err = new Error(message);
//     err.status = res.status;
//     throw err;
//   }
//   return data;
// }

// function normalize(e) {
//   if (!e) return e;
//   return { ...e, id: e.id || e._id };
// }

// export async function getEvents({ upcoming } = {}) {
//   const params = new URLSearchParams();
//   if (upcoming) params.set('upcoming', 'true');
//   const qs = params.toString();
//   const data = await backendFetch(`/events${qs ? `?${qs}` : ''}`);
//   return (data.events || []).map(normalize);
// }

// export async function getEventById(id) {
//   try {
//     const data = await backendFetch(`/events/${id}`);
//     return normalize(data.event);
//   } catch (err) {
//     if (err.status === 404) return null;
//     throw err;
//   }
// }

// export async function createEvent(input) {
//   const data = await backendFetch('/events', {
//     method: 'POST',
//     headers: { 'x-admin-key': ADMIN_KEY },
//     body: JSON.stringify(input),
//   });
//   return normalize(data.event);
// }

// export async function updateEvent(id, updates) {
//   try {
//     const data = await backendFetch(`/events/${id}`, {
//       method: 'PUT',
//       headers: { 'x-admin-key': ADMIN_KEY },
//       body: JSON.stringify(updates),
//     });
//     return normalize(data.event);
//   } catch (err) {
//     if (err.status === 404) return null;
//     throw err;
//   }
// }

// export async function deleteEvent(id) {
//   try {
//     await backendFetch(`/events/${id}`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });
//     return true;
//   } catch (err) {
//     if (err.status === 404) return false;
//     throw err;
//   }
// }

// export async function likeEvent(id) {
//   const data = await backendFetch(`/events/${id}/like`, { method: 'POST' });
//   return normalize(data.event);
// }

// lib/eventsApi.js
//
// Talks to the real Events API (Express + Mongoose backend: models/Event.js,
// routes/events.js). All calls happen server-side, from Next.js route
// handlers — the backend URL and admin key never reach the browser.
//
// IMPORTANT: the backend mounts this router at `/events`, NOT `/api/events`
// — see app.js: `app.use('/events', eventsRoutes)`. All paths below are
// relative to BASE_URL directly (no /api prefix), matching that mount.
//
// Reuses env vars you already have in .env.local:
//   BACKEND_API_URL   e.g. http://localhost:5000 or your Render URL
//   ADMIN_API_KEY     same shared secret already used for blogs/stories —
//                      sent as `x-admin-key` on create/update/delete, and
//                      checked on the backend by middlewares/auth.js's
//                      `authenticateAdmin`. Make sure the backend's own
//                      .env has the SAME ADMIN_API_KEY value set, since
//                      it's a separate server/process from this Next.js app.
//                      NOTE: your backend's routes/events.js still needs
//                      the authenticateAdmin swap applied (see the file
//                      provided alongside this one) — otherwise create/
//                      update/delete will 401, since they currently check
//                      a JWT via authenticateKey instead.

const BASE_URL = process.env.BACKEND_API_URL;
const ADMIN_KEY = process.env.ADMIN_API_KEY;

function assertBaseUrl() {
  if (!BASE_URL) {
    throw Object.assign(
      new Error('BACKEND_API_URL is not configured on the server'),
      { status: 500 }
    );
  }
}

function buildUrl(path, query) {
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const url = new URL(path.replace(/^\//, ''), base);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  return url;
}

async function backendFetch(path, { method = 'GET', body, auth = false, query } = {}) {
  assertBaseUrl();

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    if (!ADMIN_KEY) {
      throw Object.assign(
        new Error('ADMIN_API_KEY is not configured on the server'),
        { status: 500 }
      );
    }
    headers['x-admin-key'] = ADMIN_KEY;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no/invalid JSON body — fine for e.g. 204s
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Events API request failed (${res.status})`;
    throw Object.assign(new Error(message), { status: res.status, details: data });
  }

  return data;
}

// ── Shape translation ────────────────────────────────────────────────────
// Backend uses Mongo's _id and nested ticket tier docs; the frontend wants
// flat `id` fields it can key React lists on.

function normalizeTier(t) {
  return {
    id: t._id,
    name: t.name,
    perks: t.perks || [],
    price: t.price,
    totalSpots: t.totalSpots,
    spotsBooked: t.spotsBooked || 0,
  };
}

function normalizeEvent(e) {
  if (!e) return null;
  return {
    id: e._id,
    title: e.title,
    description: e.description || '',
    categories: e.categories || [],
    city: e.city,
    venue: e.venue,
    address: e.address || '',
    coordinates: e.location?.coordinates || [0, 0],
    eventDate: e.eventDate,
    startTime: e.startTime,
    endTime: e.endTime || '',
    organizerWebsite: e.organizerWebsite,
    isFree: !!e.isFree,
    price: e.price || 0,
    priceUnit: e.priceUnit || 'person',
    totalSpots: e.totalSpots || 0,
    spotsBooked: e.spotsBooked || 0,
    spotsLeft: typeof e.spotsLeft === 'number' ? e.spotsLeft : undefined,
    ticketTiers: (e.ticketTiers || []).map(normalizeTier),
    attendeeCount: e.attendeeCount || 0,
    isTrending: !!e.isTrending,
    isLiveNow: !!e.isLiveNow,
    thumbnailColor: e.thumbnailColor || '#3d1f66',
    heroImageUrl: e.heroImageUrl || '',
    isActive: e.isActive !== false,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

// Frontend form shape -> backend create/update payload.
function toBackendPayload(payload) {
  const {
    title,
    description,
    categories,
    city,
    venue,
    address,
    coordinates,
    eventDate,
    startTime,
    endTime,
    organizerWebsite,
    isFree,
    price,
    priceUnit,
    totalSpots,
    ticketTiers,
    attendeeCount,
    isTrending,
    isLiveNow,
    thumbnailColor,
    heroImageUrl,
  } = payload;

  const body = {
    title,
    description,
    categories: categories || [],
    city,
    venue,
    address,
    eventDate,
    startTime,
    endTime: endTime || undefined,
    organizerWebsite,
    isFree: !!isFree,
    price: Number(price) || 0,
    priceUnit: priceUnit || 'person',
    totalSpots: Number(totalSpots) || 0,
    ticketTiers: (ticketTiers || []).map((t) => ({
      name: t.name,
      perks: t.perks || [],
      price: Number(t.price) || 0,
      totalSpots: Number(t.totalSpots) || 0,
    })),
    attendeeCount: Number(attendeeCount) || 0,
    isTrending: !!isTrending,
    isLiveNow: !!isLiveNow,
    thumbnailColor: thumbnailColor || '#3d1f66',
    heroImageUrl: heroImageUrl || undefined,
  };

  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every((n) => Number.isFinite(Number(n)))
  ) {
    body.coordinates = [Number(coordinates[0]), Number(coordinates[1])];
  }

  return body;
}

// ── Public API used by the Next.js route handlers ───────────────────────

export async function getEvents({
  city,
  coordinates,
  maxDistance,
  category,
  trendingOnly,
  liveOnly,
  search,
  page = 1,
  limit = 20,
  upcoming,
} = {}) {
  const data = await backendFetch('/events', {
    query: {
      city,
      coordinates: coordinates ? JSON.stringify(coordinates) : undefined,
      maxDistance,
      category,
      trendingOnly,
      liveOnly,
      search,
      page,
      limit,
    },
  });

  let events = (data.events || []).map(normalizeEvent);

  // Backend has no `upcoming` filter — apply it here. Default event list is
  // already sorted ascending by eventDate (see routes/events.js), so this
  // just trims past events without needing to re-sort.
  if (upcoming === true || upcoming === 'true') {
    const now = Date.now();
    events = events.filter((e) => new Date(e.eventDate).getTime() >= now);
  }

  return {
    events,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  };
}

export async function getEventStats(city) {
  return backendFetch('/events/stats', { query: { city } });
}

export async function getCitiesSummary() {
  const data = await backendFetch('/events/meta/cities-summary');
  return data.cities || [];
}

export async function getEventById(id) {
  try {
    const data = await backendFetch(`/events/${id}`);
    return normalizeEvent(data.event);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function createEvent(payload) {
  const body = toBackendPayload(payload);
  const data = await backendFetch('/events', { method: 'POST', body, auth: true });
  return normalizeEvent(data.event);
}

export async function updateEvent(id, payload) {
  const body = toBackendPayload(payload);
  try {
    const data = await backendFetch(`/events/${id}`, { method: 'PUT', body, auth: true });
    return normalizeEvent(data.event);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

// Soft delete (isActive: false) — matches the backend's default DELETE
// route, which intentionally preserves history for existing bookings.
export async function deleteEvent(id) {
  try {
    await backendFetch(`/events/${id}`, { method: 'DELETE', auth: true });
    return true;
  } catch (err) {
    if (err.status === 404) return false;
    throw err;
  }
}