// import { getStore } from '@netlify/blobs';

// // Same approach as lib/blogsStore.js — see that file for the fuller
// // explanation. All stories live as one JSON blob under key "all" in the
// // "stories" store.

// const STORE_NAME = 'stories';
// const KEY = 'all';

// function store() {
//   // When deployed on Netlify (or running via `netlify dev`), Netlify
//   // injects context automatically and getStore(name) alone is enough.
//   // When running plain `next dev` locally, NETLIFY_SITE_ID/NETLIFY_AUTH_TOKEN
//   // must be supplied explicitly (see .env.local).
//   if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN) {
//     return getStore({
//       name: STORE_NAME,
//       siteID: process.env.NETLIFY_SITE_ID,
//       token: process.env.NETLIFY_AUTH_TOKEN,
//     });
//   }
//   return getStore(STORE_NAME);
// }

// async function readAll() {
//   const data = await store().get(KEY, { type: 'json' });
//   return data || [];
// }

// async function writeAll(stories) {
//   await store().setJSON(KEY, stories);
// }

// export async function getStories() {
//   const stories = await readAll();
//   return [...stories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// }

// export async function getStoryById(id) {
//   const stories = await readAll();
//   return stories.find((s) => s.id === id) || null;
// }

// export async function createStory(input) {
//   const stories = await readAll();

//   const required = ['quote', 'author'];
//   const missing = required.filter((f) => !input[f] || !String(input[f]).trim());
//   if (missing.length) {
//     throw new Object.assign(new Error(`Missing required field(s): ${missing.join(', ')}`), {
//       status: 400,
//     });
//   }

//   const story = {
//     id: Date.now().toString(),
//     quote: input.quote,
//     author: input.author,
//     meta: input.meta || 'Matched on Strange In',
//     image: input.image || null,
//     likes: 0,
//     createdAt: new Date().toISOString(),
//   };

//   stories.push(story);
//   await writeAll(stories);
//   return story;
// }

// export async function updateStory(id, updates) {
//   const stories = await readAll();
//   const idx = stories.findIndex((s) => s.id === id);
//   if (idx === -1) return null;

//   const allowed = ['quote', 'author', 'meta', 'image', 'likes'];
//   const next = { ...stories[idx] };
//   for (const key of allowed) {
//     if (key in updates) next[key] = updates[key];
//   }
//   stories[idx] = next;
//   await writeAll(stories);
//   return next;
// }

// export async function deleteStory(id) {
//   const stories = await readAll();
//   const idx = stories.findIndex((s) => s.id === id);
//   if (idx === -1) return false;
//   stories.splice(idx, 1);
//   await writeAll(stories);
//   return true;
// }

// export async function likeStory(id) {
//   const stories = await readAll();
//   const idx = stories.findIndex((s) => s.id === id);
//   if (idx === -1) return null;
//   stories[idx].likes = (stories[idx].likes || 0) + 1;
//   await writeAll(stories);
//   return stories[idx];
// }

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
    const message = typeof data.error === 'string' ? data.error : data.error?.message || data.message || 'Backend request failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

function normalize(s) {
  if (!s) return s;
  return { ...s, id: s.id || s._id };
}

export async function getStories({ search } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const qs = params.toString();
  const data = await backendFetch(`/stories${qs ? `?${qs}` : ''}`);
  return (data.stories || []).map(normalize);
}

export async function getStoryById(id) {
  try {
    const data = await backendFetch(`/stories/${id}`);
    return normalize(data.story);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function createStory(input) {
  const data = await backendFetch('/stories', {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY },
    body: JSON.stringify(input),
  });
  return normalize(data.story);
}

export async function updateStory(id, updates) {
  try {
    const data = await backendFetch(`/stories/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify(updates),
    });
    return normalize(data.story);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function deleteStory(id) {
  try {
    await backendFetch(`/stories/${id}`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });
    return true;
  } catch (err) {
    if (err.status === 404) return false;
    throw err;
  }
}

export async function likeStory(id) {
  const data = await backendFetch(`/stories/${id}/like`, { method: 'POST' });
  return normalize(data.story);
}

export async function getStoryComments(id) {
  const data = await backendFetch(`/stories/${id}/comments`);
  return data.comments || [];
}

export async function addStoryComment(id, { name, text }) {
  const data = await backendFetch(`/stories/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ name, text }),
  });
  return data.comments || [];
}