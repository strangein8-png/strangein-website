'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const EMPTY_FORM = {
  id: null,
  title: '',
  description: '',
  eventDate: '',
  location: '',
  link: '',
  organizer: '',
  image: '',
};

export default function AdminEventsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [checkingSavedKey, setCheckingSavedKey] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function verifyKey(key) {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'x-admin-key': key },
    });
    return res.ok;
  }

  useEffect(() => {
    async function checkSavedKey() {
      const saved = sessionStorage.getItem('adminKey');
      if (saved) {
        const valid = await verifyKey(saved);
        if (valid) {
          setAdminKey(saved);
          setKeySaved(true);
        } else {
          sessionStorage.removeItem('adminKey');
        }
      }
      setCheckingSavedKey(false);
    }
    checkSavedKey();
  }, []);

  useEffect(() => {
    if (keySaved) loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySaved]);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } finally {
      setLoading(false);
    }
  }

  async function saveKey() {
    if (!adminKey.trim()) {
      setLoginError('Enter the admin key.');
      return;
    }
    setLoggingIn(true);
    setLoginError('');
    try {
      const valid = await verifyKey(adminKey);
      if (!valid) {
        setLoginError('Incorrect admin key.');
        return;
      }
      sessionStorage.setItem('adminKey', adminKey);
      setKeySaved(true);
    } catch {
      setLoginError('Network error — is the site reachable?');
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    sessionStorage.removeItem('adminKey');
    setAdminKey('');
    setKeySaved(false);
    setLoginError('');
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

  function startEdit(ev) {
    setForm({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().slice(0, 16) : '',
      location: ev.location,
      link: ev.link || '',
      organizer: ev.organizer || '',
      image: ev.image || '',
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
    const url = isEdit ? `/api/events/${form.id}` : '/api/events';
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

      setStatus(isEdit ? 'Event updated.' : 'Event published.');
      resetForm();
      loadEvents();
    } catch {
      setStatus('Network error — is the dev server running?');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) loadEvents();
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Failed to delete.');
    }
  }

  if (checkingSavedKey) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.muted}>Checking session…</p>
        </div>
      </main>
    );
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
            onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            disabled={loggingIn}
          />
          {loginError && <p style={styles.errorText}>{loginError}</p>}
          <button style={styles.btnPrimary} onClick={saveKey} disabled={loggingIn}>
            {loggingIn ? 'Checking…' : 'Continue'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 720 }}>
        <nav style={styles.tabRow}>
          <Link href="/admin/blogs" style={styles.tabLink}>
            Blogs
          </Link>
          <Link href="/admin/stories" style={styles.tabLink}>
            Stories
          </Link>
          <span style={styles.tabLinkActive}>Events</span>
        </nav>
      </div>

      <div style={{ ...styles.card, maxWidth: 720 }}>
        <div style={styles.headerRow}>
          <h1 style={styles.h1}>{form.id ? 'Edit event' : 'Create a new event'}</h1>
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
            Description
            <textarea
              style={{ ...styles.input, ...styles.textarea, minHeight: 120 }}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
            />
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Date &amp; time
              <input
                style={styles.input}
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => updateField('eventDate', e.target.value)}
                required
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Location
              <input
                style={styles.input}
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                required
              />
            </label>
          </div>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Organizer (optional)
              <input
                style={styles.input}
                value={form.organizer}
                onChange={(e) => updateField('organizer', e.target.value)}
                placeholder="Strange In"
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Registration link (optional)
              <input
                style={styles.input}
                value={form.link}
                onChange={(e) => updateField('link', e.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>

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
            <button style={styles.btnPrimary} type="submit" disabled={uploading}>
              {form.id ? 'Save changes' : 'Publish event'}
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
        <h2 style={styles.h2}>Existing events {loading && '(loading…)'}</h2>
        <div style={styles.list}>
          {events.map((ev) => (
            <div key={ev.id} style={styles.listItem}>
              <div>
                <strong>{ev.title}</strong>
                <div style={styles.muted}>
                  {new Date(ev.eventDate).toLocaleString()} · {ev.location} · ♥ {ev.likes}
                </div>
              </div>
              <div style={styles.row}>
                <button style={styles.btnGhost} onClick={() => startEdit(ev)}>
                  Edit
                </button>
                <button style={styles.btnDanger} onClick={() => handleDelete(ev.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && events.length === 0 && <p style={styles.muted}>No events yet.</p>}
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
  errorText: { color: '#FF6B8A', fontSize: '0.85rem' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tabRow: { display: 'flex', gap: 8, padding: 0 },
  tabLink: {
    padding: '8px 18px',
    borderRadius: 999,
    color: '#9A8FA3',
    textDecoration: 'none',
    fontSize: '0.88rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  tabLinkActive: {
    padding: '8px 18px',
    borderRadius: 999,
    color: 'white',
    fontSize: '0.88rem',
    background: 'linear-gradient(135deg, #FF3E6C, #FF6B8A)',
  },
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