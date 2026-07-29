import { getStore } from '@netlify/blobs';

// Netlify Blobs replaces the old JSON-file approach. It works exactly the
// same conceptually (read the whole list, mutate, write it back) but is
// backed by Netlify's persistent blob storage instead of the filesystem,
// which is read-only once deployed (EROFS errors otherwise).
//
// All blogs are stored as a single JSON blob under the key "all" in the
// "blogs" store. This is simplest for a small/medium content set. If you
// ever have thousands of posts, switch to one blob per post + an index.

const STORE_NAME = 'blogs';
const KEY = 'all';

function store() {
  return getStore(STORE_NAME);
}

async function readAll() {
  const data = await store().get(KEY, { type: 'json' });
  return data || [];
}

async function writeAll(blogs) {
  await store().setJSON(KEY, blogs);
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getBlogs({ category } = {}) {
  const blogs = await readAll();
  const sorted = [...blogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  if (category && category !== 'All') {
    return sorted.filter((b) => b.cat === category);
  }
  return sorted;
}

export async function getBlogById(id) {
  const blogs = await readAll();
  return blogs.find((b) => b.id === id || b.slug === id) || null;
}

export async function createBlog(input) {
  const blogs = await readAll();

  const required = ['title', 'excerpt', 'content', 'cat', 'author'];
  const missing = required.filter((f) => !input[f] || !String(input[f]).trim());
  if (missing.length) {
    throw new Object.assign(new Error(`Missing required field(s): ${missing.join(', ')}`), {
      status: 400,
    });
  }

  const id = Date.now().toString();
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let n = 2;
  while (blogs.some((b) => b.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const blog = {
    id,
    slug,
    cat: input.cat,
    featured: Boolean(input.featured),
    gold: Boolean(input.gold),
    grad: input.grad || `g${(blogs.length % 5) + 1}`,
    likes: 0,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    image: input.image || null,
    initials:
      input.initials ||
      input.author
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    author: input.author,
    meta: input.meta || 'New',
    createdAt: new Date().toISOString(),
  };

  blogs.push(blog);
  await writeAll(blogs);
  return blog;
}

export async function updateBlog(id, updates) {
  const blogs = await readAll();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const allowed = [
    'title',
    'excerpt',
    'content',
    'cat',
    'featured',
    'gold',
    'grad',
    'author',
    'initials',
    'meta',
    'likes',
    'image',
  ];
  const next = { ...blogs[idx] };
  for (const key of allowed) {
    if (key in updates) next[key] = updates[key];
  }
  blogs[idx] = next;
  await writeAll(blogs);
  return next;
}

export async function deleteBlog(id) {
  const blogs = await readAll();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  blogs.splice(idx, 1);
  await writeAll(blogs);
  return true;
}

export async function likeBlog(id) {
  const blogs = await readAll();
  const idx = blogs.findIndex((b) => b.id === id || b.slug === id);
  if (idx === -1) return null;
  blogs[idx].likes = (blogs[idx].likes || 0) + 1;
  await writeAll(blogs);
  return blogs[idx];
}