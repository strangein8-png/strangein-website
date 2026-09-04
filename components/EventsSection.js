// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Reveal from './Reveal';
// import LikeButton from './LikeButton';

// function gradClass(id) {
//   const str = String(id || '');
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 5;
//   return `g${hash + 1}`;
// }

// function formatEventDate(dateStr) {
//   const d = new Date(dateStr);
//   return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
//     ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
// }

// export default function EventsSection() {
//   const router = useRouter();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     fetch('/api/events?upcoming=true')
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to load events');
//         return res.json();
//       })
//       .then((data) => {
//         if (!cancelled) setEvents(data.events || []);
//       })
//       .catch((err) => {
//         if (!cancelled) setError(err.message);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => { cancelled = true; };
//   }, []);

//   if (!loading && !error && events.length === 0) return null;

//   return (
//     <section id="events">
//       <Reveal className="blogs-head">
//         <div>
//           <div className="section-eyebrow">Happening soon</div>
//           <h2>
//             Upcoming <em>Events</em>
//           </h2>
//           <p className="section-sub">
//             Meetups, mixers, and get-togethers for the Strange In community.
//           </p>
//         </div>
//       </Reveal>

//       {error && <p className="section-sub">Couldn&rsquo;t load events right now.</p>}

//       <div className="blogs-grid">
//         {events.map((ev) => (
//           <Reveal
//             as="article"
//             key={ev.id}
//             className="blog-card"
//             onClick={() => router.push(`/event/${ev.id}`)}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="blog-img">
//               {ev.image ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img src={ev.image} alt={ev.title} className="blog-img-photo" />
//               ) : (
//                 <div className={`grad ${gradClass(ev.id)}`} />
//               )}
//               <span className="blog-cat">{formatEventDate(ev.eventDate)}</span>
//               <LikeButton id={ev.id} initialLikes={ev.likes} endpoint="events" resourceKey="event" />
//             </div>
//             <div className="blog-body">
//               <h3 className="blog-title">{ev.title}</h3>
//               <p className="blog-excerpt">{ev.description}</p>
//               <div className="blog-author">
//                 <div className="av"><div>📍</div></div>
//                 <div className="who">
//                   <strong>{ev.location}</strong>
//                   <span>{ev.organizer}</span>
//                 </div>
//               </div>
//             </div>
//           </Reveal>
//         ))}
//       </div>
//     </section>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './Reveal';
import { formatEventWhen, formatPrice } from '@/lib/eventFormat';

const CATEGORIES = ['All', 'Dating', 'Social', 'Music', 'Food'];

export default function EventsSection() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ upcoming: 'true' });
    if (category !== 'All') params.set('category', category);

    fetch(`/api/events?${params.toString()}`)
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

    return () => {
      cancelled = true;
    };
  }, [category]);

  // Only hide the whole section on the unfiltered "All" view with nothing
  // to show. If a category filter comes back empty we still show the tabs
  // plus an empty-state message, so the filter itself stays usable.
  if (!loading && !error && events.length === 0 && category === 'All') return null;

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

      <div className="event-cat-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`event-cat-tab ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p className="section-sub">Couldn&rsquo;t load events right now.</p>}
      {!error && !loading && events.length === 0 && (
        <p className="section-sub">
          No {category !== 'All' ? `${category.toLowerCase()} ` : ''}events right now — check back soon.
        </p>
      )}

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
              {ev.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.heroImageUrl} alt={ev.title} className="blog-img-photo" />
              ) : (
                <div style={{ width: '100%', height: '100%', background: ev.thumbnailColor }} />
              )}
              <span className="blog-cat">{formatEventWhen(ev)}</span>
              {ev.isTrending && <span className="event-badge event-badge-trending">🔥 Trending</span>}
              {ev.isLiveNow && <span className="event-badge event-badge-live">Live now</span>}
            </div>
            <div className="blog-body">
              {ev.categories?.length > 0 && (
                <div className="event-tags">
                  {ev.categories.map((c) => (
                    <span key={c} className="event-tag">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="blog-title">{ev.title}</h3>
              <p className="blog-excerpt">{ev.description}</p>
              <div className="blog-author">
                <div className="av">
                  <div>📍</div>
                </div>
                <div className="who">
                  <strong>{ev.venue}</strong>
                  <span>{ev.city}</span>
                </div>
              </div>
              <div className="event-meta-row">
                <span className="event-price">{formatPrice(ev)}</span>
                {ev.attendeeCount > 0 && (
                  <span className="event-attendees">+{ev.attendeeCount} going</span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}