import fs from 'fs/promises';
import path from 'path';

// Same JSON-file approach as lib/blogsStore.js — see that file for the
// fuller explanation of tradeoffs (fine for local/dev and a persistent
// server, not for serverless hosts with a read-only filesystem).

const DATA_FILE = path.join(process.cwd(), 'data', 'stories.json');

async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(stories) {
  await fs.writeFile(DATA_FILE, JSON.stringify(stories, null, 2), 'utf-8');
}

export async function getStories() {
  const stories = await readAll();
  return [...stories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getStoryById(id) {
  const stories = await readAll();
  return stories.find((s) => s.id === id) || null;
}

export async function createStory(input) {
  const stories = await readAll();

  const required = ['quote', 'author'];
  const missing = required.filter((f) => !input[f] || !String(input[f]).trim());
  if (missing.length) {
    throw new Object.assign(new Error(`Missing required field(s): ${missing.join(', ')}`), {
      status: 400,
    });
  }

  const story = {
    id: Date.now().toString(),
    quote: input.quote,
    author: input.author,
    meta: input.meta || 'Matched on Strange In',
    image: input.image || null,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  stories.push(story);
  await writeAll(stories);
  return story;
}

export async function updateStory(id, updates) {
  const stories = await readAll();
  const idx = stories.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const allowed = ['quote', 'author', 'meta', 'image', 'likes'];
  const next = { ...stories[idx] };
  for (const key of allowed) {
    if (key in updates) next[key] = updates[key];
  }
  stories[idx] = next;
  await writeAll(stories);
  return next;
}

export async function deleteStory(id) {
  const stories = await readAll();
  const idx = stories.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  stories.splice(idx, 1);
  await writeAll(stories);
  return true;
}

export async function likeStory(id) {
  const stories = await readAll();
  const idx = stories.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  stories[idx].likes = (stories[idx].likes || 0) + 1;
  await writeAll(stories);
  return stories[idx];
}