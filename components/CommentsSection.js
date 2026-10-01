'use client';

import { useEffect, useState } from 'react';
import { validateCommentText } from '@/lib/validateComment';

export default function CommentsSection({ id, endpoint = 'blogs' }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/${endpoint}/${id}/comments`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setComments(data.comments || []); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, endpoint]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !text.trim()) {
      setError('Please add your name and a comment.');
      return;
    }

    const textError = validateCommentText(text) || validateCommentText(name);
    if (textError) {
      setError(textError);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/${endpoint}/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to post comment.');
        return;
      }
      setComments(data.comments || []);
      setText('');
    } catch {
      setError('Network error — try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function getInitials(fullName) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments {comments.length > 0 && `(${comments.length})`}</h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="comment-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />
        <textarea
          className="comment-textarea"
          placeholder="Write a comment… (text only, no links)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />
        {error && <p className="comment-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
        </button>
      </form>

      <div className="comment-list">
        {loading && <p className="section-sub">Loading comments…</p>}
        {!loading && comments.length === 0 && <p className="section-sub">Be the first to comment.</p>}
        {comments.map((c) => (
          <div className="comment-item" key={c._id}>
            <div className="comment-avatar">{getInitials(c.name)}</div>
            <div className="comment-body">
              <div className="comment-header">
                <strong>{c.name}</strong>
                <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}