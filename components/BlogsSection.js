'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Reveal from './Reveal';
import LikeButton from './LikeButton';

const CATEGORIES = ['All', 'Travel', 'Food', 'Life', 'Art'];

export default function BlogsSection() {
  const router = useRouter();
  const [active, setActive] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url =
      active === 'All' ? '/api/blogs' : `/api/blogs?category=${encodeURIComponent(active)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blogs');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPosts(data.blogs || []);
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
  }, [active]);

  return (
    <section id="blogs">
      <Reveal className="blogs-head">
        <div>
          <div className="section-eyebrow">From the community</div>
          <h2>
            The Strange In <em>Blogs</em>
          </h2>
          <p className="section-sub">
            Real stories from real people on the app — travel diaries, food
            trails, and everything in between.
          </p>
        </div>
      </Reveal>

      <Reveal className="blog-pills" role="tablist" aria-label="Blog categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`pill ${active === cat ? 'active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {error && <p className="section-sub">Couldn&rsquo;t load blogs right now.</p>}
      {!error && !loading && posts.length === 0 && (
        <p className="section-sub">No blogs in this category yet.</p>
      )}

      <div className="blogs-grid">
        {posts.map((post) => (
          <Reveal
            as="article"
            key={post.id}
            className={`blog-card ${post.featured ? 'featured' : ''}`}
            onClick={() => router.push(`/blog/${post.slug}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="blog-img">
              {post.image ? (
                <img src={post.image} alt={post.title} className="blog-img-photo" />
              ) : (
                <div className={`grad ${post.grad}`} />
              )}
              <div className="orb" />
              <span className={`blog-cat ${post.gold ? 'gold' : ''}`}>{post.cat}</span>
              <LikeButton id={post.id} initialLikes={post.likes} />
            </div>
            <div className="blog-body">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-author">
                <div className="av">
                  <div>{post.initials}</div>
                </div>
                <div className="who">
                  <strong>{post.author}</strong>
                  <span>{post.meta}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="blogs-more">
        <Link className="btn-ghost" href="/#download">
          Read more in the app →
        </Link>
      </Reveal>
    </section>
  );
}