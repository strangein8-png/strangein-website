'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import LikeButton from './LikeButton';

export default function StoriesSection() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stories')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stories');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStories(data.stories || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !error && stories.length === 0) return null;

  return (
    <section className="band" id="stories">
      <Reveal>
        <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
          Real matches
        </div>
      </Reveal>

      {error && <p className="section-sub">Couldn&rsquo;t load stories right now.</p>}

      <div className="stories-grid">
        {stories.map((story) => (
          <Reveal as="figure" key={story.id} className="story-card">
            {story.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.image} alt={story.author} className="story-photo" />
            )}
            <blockquote>&ldquo;{story.quote}&rdquo;</blockquote>
            <figcaption>
              
                — {story.author}, {story.meta}
              
              <LikeButton
                id={story.id}
                initialLikes={story.likes}
                className="blog-like story-like"
                endpoint="stories"
                resourceKey="story"
              />
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}