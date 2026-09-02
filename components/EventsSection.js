'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './Reveal';
import LikeButton from './LikeButton';

function gradClass(id) {
  const str = String(id || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 5;
  return `g${hash + 1}`;
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function EventsSection() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/events?upcoming=true')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load events');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setEvents(data.events || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (!loading && !error && events.length === 0) return null;

  return (
    <section id="events">
      <Reveal className="blogs-head">
        <div>
          <div className="section-eyebrow">Happening soon</div>
          <h2>
            Upcoming <em>Events</em>
          </h2>
          <p className="section-sub">
            Meetups, mixers, and get-togethers for the Strange In community.
          </p>
        </div>
      </Reveal>

      {error && <p className="section-sub">Couldn&rsquo;t load events right now.</p>}

      <div className="blogs-grid">
        {events.map((ev) => (
          <Reveal
            as="article"
            key={ev.id}
            className="blog-card"
            onClick={() => router.push(`/event/${ev.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="blog-img">
              {ev.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.image} alt={ev.title} className="blog-img-photo" />
              ) : (
                <div className={`grad ${gradClass(ev.id)}`} />
              )}
              <span className="blog-cat">{formatEventDate(ev.eventDate)}</span>
              <LikeButton id={ev.id} initialLikes={ev.likes} endpoint="events" resourceKey="event" />
            </div>
            <div className="blog-body">
              <h3 className="blog-title">{ev.title}</h3>
              <p className="blog-excerpt">{ev.description}</p>
              <div className="blog-author">
                <div className="av"><div>📍</div></div>
                <div className="who">
                  <strong>{ev.location}</strong>
                  <span>{ev.organizer}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}