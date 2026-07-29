'use client';

import { useState } from 'react';

export default function LikeButton({
  id,
  initialLikes = 0,
  className = 'blog-like',
  endpoint = 'blogs', // 'blogs' or 'stories' — which API collection this belongs to
  resourceKey = 'blog', // the key the API returns the updated item under
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;

    setLikes((n) => n + 1);
    setLiked(true);

    try {
      const res = await fetch(`/api/${endpoint}/${id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to like');
      const data = await res.json();
      setLikes(data[resourceKey].likes);
    } catch {
      setLikes((n) => n - 1);
      setLiked(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleLike}
      aria-label="Like this"
      aria-pressed={liked}
      style={{ cursor: liked ? 'default' : 'pointer', border: 'none', font: 'inherit' }}
    >
      {liked ? '♥' : '♡'} {likes}
    </button>
  );
}