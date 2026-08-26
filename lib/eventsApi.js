const BACKEND_URL = process.env.BACKEND_API_URL;
const ADMIN_KEY = process.env.ADMIN_API_KEY;

async function backendFetch(path, options = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data.error === 'string' ? data.error : data.message || 'Backend request failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

function normalize(e) {
  if (!e) return e;
  return { ...e, id: e.id || e._id };
}

export async function getEvents({ upcoming } = {}) {
  const params = new URLSearchParams();
  if (upcoming) params.set('upcoming', 'true');
  const qs = params.toString();
  const data = await backendFetch(`/events${qs ? `?${qs}` : ''}`);
  return (data.events || []).map(normalize);
}

export async function getEventById(id) {
  try {
    const data = await backendFetch(`/events/${id}`);
    return normalize(data.event);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function createEvent(input) {
  const data = await backendFetch('/events', {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY },
    body: JSON.stringify(input),
  });
  return normalize(data.event);
}

export async function updateEvent(id, updates) {
  try {
    const data = await backendFetch(`/events/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify(updates),
    });
    return normalize(data.event);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function deleteEvent(id) {
  try {
    await backendFetch(`/events/${id}`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });
    return true;
  } catch (err) {
    if (err.status === 404) return false;
    throw err;
  }
}

export async function likeEvent(id) {
  const data = await backendFetch(`/events/${id}/like`, { method: 'POST' });
  return normalize(data.event);
}