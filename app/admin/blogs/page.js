'use client';

import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  id: null,
  title: '',
  excerpt: '',
  content: '',
  cat: 'Travel',
  author: '',
  initials: '',
  meta: '',
  featured: false,
  gold: false,
  image: '',
};

export default function AdminBlogsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminKey');
    if (saved) {
      setAdminKey(saved);
      setKeySaved(true);
    }
  }, []);

  useEffect(() => {
    if (keySaved) loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySaved]);

  async function loadBlogs() {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } finally {
      setLoading(false);
    }
  }

  function saveKey() {
    sessionStorage.setItem('adminKey', adminKey);
    setKeySaved(true);
  }

  function logout() {
    sessionStorage.removeItem('adminKey');
    setAdminKey('');
    setKeySaved(false);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('');

    const body = new FormData();
    body.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || 'Image upload failed.');
        return;
      }

      updateField('image', data.url);
    } catch {
      setStatus('Network error while uploading image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage() {
    updateField('image', '');
  }

  function startEdit(blog) {
    setForm({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || '',
      cat: blog.cat,
      author: blog.author,
      initials: blog.initials,
      meta: blog.meta,
      featured: !!blog.featured,
      gold: !!blog.gold,
      image: blog.image || '',
    });
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('Saving…');

    const isEdit = Boolean(form.id);
    const url = isEdit ? `/api/blogs/${form.id}` : '/api/blogs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || 'Something went wrong.');
        return;
      }

      setStatus(isEdit ? 'Blog updated.' : 'Blog published.');
      resetForm();
      loadBlogs();
    } catch (err) {
      setStatus('Network error — is the dev server running?');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this blog?')) return;
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) loadBlogs();
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Failed to delete.');
    }
  }

  if (!keySaved) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Admin sign-in</h1>
          <p style={styles.muted}>
            Enter the admin key set as <code>ADMIN_API_KEY</code> on the server.
          </p>
          <input
            style={styles.input}
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
          <button style={styles.btnPrimary} onClick={saveKey}>
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 720 }}>
        <div style={styles.headerRow}>
          <h1 style={styles.h1}>{form.id ? 'Edit blog' : 'Write a new blog'}</h1>
          <button style={styles.btnGhost} onClick={logout}>
            Sign out
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Title
            <input
              style={styles.input}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Excerpt (short summary shown on the card)
            <textarea
              style={{ ...styles.input, ...styles.textarea, minHeight: 70 }}
              value={form.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Content
            <textarea
              style={{ ...styles.input, ...styles.textarea, minHeight: 180 }}
              value={form.content}
              onChange={(e) => updateField('content', e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Cover image (optional)
            <input
              style={styles.input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              disabled={uploading}
            />
          </label>

          {uploading && <p style={styles.muted}>Uploading…</p>}

          {form.image && (
            <div style={styles.imagePreviewWrap}>
              <img src={form.image} alt="Cover preview" style={styles.imagePreview} />
              <button type="button" style={styles.btnGhost} onClick={removeImage}>
                Remove image
              </button>
            </div>
          )}

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Category
              <select
                style={styles.input}
                value={form.cat}
                onChange={(e) => updateField('cat', e.target.value)}
              >
                {['Travel', 'Food', 'Life', 'Art'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ ...styles.label, flex: 1 }}>
              Author
              <input
                style={styles.input}
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                required
              />
            </label>
          </div>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Initials (optional)
              <input
                style={styles.input}
                value={form.initials}
                onChange={(e) => updateField('initials', e.target.value)}
                maxLength={3}
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Meta text (optional, e.g. &ldquo;5 min read · today&rdquo;)
              <input
                style={styles.input}
                value={form.meta}
                onChange={(e) => updateField('meta', e.target.value)}
              />
            </label>
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
              />
              Featured (large card)
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.gold}
                onChange={(e) => updateField('gold', e.target.checked)}
              />
              Gold category badge
            </label>
          </div>

          <div style={styles.row}>
            <button style={styles.btnPrimary} type="submit" disabled={uploading}>
              {form.id ? 'Save changes' : 'Publish blog'}
            </button>
            {form.id && (
              <button type="button" style={styles.btnGhost} onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          {status && <p style={styles.muted}>{status}</p>}
        </form>
      </div>

      <div style={{ ...styles.card, maxWidth: 720 }}>
        <h2 style={styles.h2}>Existing blogs {loading && '(loading…)'}</h2>
        <div style={styles.list}>
          {blogs.map((b) => (
            <div key={b.id} style={styles.listItem}>
              <div>
                <strong>{b.title}</strong>
                <div style={styles.muted}>
                  {b.cat} · {b.author} · ♥ {b.likes}
                </div>
              </div>
              <div style={styles.row}>
                <button style={styles.btnGhost} onClick={() => startEdit(b)}>
                  Edit
                </button>
                <button style={styles.btnDanger} onClick={() => handleDelete(b.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && blogs.length === 0 && <p style={styles.muted}>No blogs yet.</p>}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0D0A0F',
    color: '#F7EFF1',
    padding: '48px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    fontFamily: 'Outfit, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#1D1622',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 28,
  },
  h1: { fontSize: '1.4rem', marginBottom: 8 },
  h2: { fontSize: '1.1rem', marginBottom: 16 },
  muted: { color: '#9A8FA3', fontSize: '0.85rem' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: '#9A8FA3' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '10px 12px',
    color: '#F7EFF1',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
  },
  textarea: { resize: 'vertical' },
  imagePreviewWrap: { display: 'flex', alignItems: 'center', gap: 16 },
  imagePreview: {
    width: 120,
    height: 80,
    objectFit: 'cover',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  row: { display: 'flex', gap: 12, alignItems: 'center' },
  checkboxLabel: { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' },
  btnPrimary: {
    background: 'linear-gradient(135deg, #FF3E6C, #FF6B8A)',
    border: 'none',
    borderRadius: 999,
    padding: '10px 20px',
    color: 'white',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnGhost: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 999,
    padding: '10px 20px',
    color: '#F7EFF1',
    cursor: 'pointer',
  },
  btnDanger: {
    background: 'rgba(255,62,108,0.12)',
    border: '1px solid rgba(255,62,108,0.4)',
    borderRadius: 999,
    padding: '10px 20px',
    color: '#FF6B8A',
    cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    gap: 12,
  },
};