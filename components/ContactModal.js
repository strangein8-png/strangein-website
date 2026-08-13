'use client';

import { useState } from 'react';

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      setStatus({ loading: false, success: true, error: null });
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={triggerStyle}>
        Contact
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={cardStyle}>
            <button onClick={() => setOpen(false)} style={closeStyle} aria-label="Close">×</button>

            <div style={headerStyle}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>💌</div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>
                Let's talk, Strange In
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                Questions, feedback, or a love story to share — we're listening.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required style={inputStyle} />
              <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required style={inputStyle} />
              <input type="text" name="subject" placeholder="Subject (optional)" value={form.subject} onChange={handleChange} style={inputStyle} />
              <textarea name="message" placeholder="Tell us what's on your mind..." rows={4} value={form.message} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />

              <button type="submit" disabled={status.loading} style={submitStyle(status.loading)}>
                {status.loading ? 'Sending your message...' : 'Send Message 💘'}
              </button>

              {status.success && (
                <p style={{ color: '#16a34a', margin: 0, fontSize: 13, textAlign: 'center' }}>
                  🎉 Sent! Check your inbox for a confirmation.
                </p>
              )}
              {status.error && (
                <p style={{ color: '#dc2626', margin: 0, fontSize: 13, textAlign: 'center' }}>
                  {status.error}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const triggerStyle = {
  background: 'none', border: 'none', padding: 0, font: 'inherit',
  cursor: 'pointer', color: 'inherit', textAlign: 'left',
};

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(20,10,20,0.65)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 1000, padding: 16,
};

const cardStyle = {
  background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420,
  position: 'relative', overflow: 'hidden',
  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
};

const closeStyle = {
  position: 'absolute', top: 14, right: 14, border: 'none',
  background: 'rgba(255,255,255,0.25)', color: '#fff', width: 28, height: 28,
  borderRadius: '50%', fontSize: 18, cursor: 'pointer', zIndex: 2,
  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
};

const headerStyle = {
  background: 'linear-gradient(135deg, #e11d48, #be185d, #9333ea)',
  padding: '28px 24px 20px', textAlign: 'center',
};

const inputStyle = {
  padding: '12px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
  font: 'inherit', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
  background: '#fafafa',
};

const submitStyle = (loading) => ({
  background: loading ? '#f0a5b8' : 'linear-gradient(135deg, #e11d48, #be185d)',
  color: '#fff', border: 'none', padding: '13px 16px', borderRadius: 10,
  cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 15,
  marginTop: 4, transition: 'transform 0.15s',
});