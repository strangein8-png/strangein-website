// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import { getEventById } from '@/lib/eventsApi';
// import LikeButton from '@/components/LikeButton';

// export async function generateMetadata({ params }) {
//   const event = await getEventById(params.id);
//   if (!event) return { title: 'Event not found — Strange In' };
//   return { title: `${event.title} — Strange In`, description: event.description };
// }

// function formatEventDate(dateStr) {
//   const d = new Date(dateStr);
//   return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) +
//     ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
// }

// export default async function EventDetailPage({ params }) {
//   const event = await getEventById(params.id);
//   if (!event) notFound();

//   return (
//     <main className="blog-detail">
//       <div className="blog-detail-inner">
//         <Link href="/events" className="btn-ghost blog-back">← Back to events</Link>

//         <div className={`blog-detail-hero ${event.image ? '' : 'grad g1'}`}>
//           {event.image && (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={event.image} alt={event.title} className="blog-detail-photo" />
//           )}
//           <span className="blog-cat">{formatEventDate(event.eventDate)}</span>
//         </div>

//         <h1 className="blog-detail-title">{event.title}</h1>

//         <div className="blog-author blog-detail-author">
//           <div className="av"><div>📍</div></div>
//           <div className="who">
//             <strong>{event.location}</strong>
//             <span>{event.organizer}</span>
//           </div>
//         </div>

//         <p className="blog-detail-content">{event.description}</p>

//         {event.link && (
//           <a
//             href={event.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="btn-primary"
//             style={{ display: 'inline-block', marginTop: 8 }}
//           >
//             Register / Learn more →
//           </a>
//         )}

//         <div className="blog-detail-footer">
//           <LikeButton
//             id={event.id}
//             initialLikes={event.likes}
//             className="blog-like blog-like-standalone"
//             endpoint="events"
//             resourceKey="event"
//           />
//         </div>
//       </div>
//     </main>
//   );
// }

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/eventsApi';
import { formatEventWhen, formatPrice } from '@/lib/eventFormat';

export async function generateMetadata({ params }) {
  const event = await getEventById(params.id);
  if (!event) return { title: 'Event not found — Strange In' };
  return { title: `${event.title} — Strange In`, description: event.description };
}

export default async function EventDetailPage({ params }) {
  const event = await getEventById(params.id);
  if (!event) notFound();

  const hasTiers = event.ticketTiers && event.ticketTiers.length > 0;
  const locationLine = [event.address, event.city].filter(Boolean).join(', ');

  return (
    <main className="blog-detail">
      <div className="blog-detail-inner">
        <Link href="/events" className="btn-ghost blog-back">
          ← Back to events
        </Link>

        <div
          className="blog-detail-hero"
          style={!event.heroImageUrl ? { background: event.thumbnailColor } : undefined}
        >
          {event.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.heroImageUrl} alt={event.title} className="blog-detail-photo" />
          )}
          <span className="blog-cat">{formatEventWhen(event)}</span>
          {event.isTrending && <span className="event-badge event-badge-trending">🔥 Trending</span>}
          {event.isLiveNow && <span className="event-badge event-badge-live">Live now</span>}
        </div>

        {event.categories?.length > 0 && (
          <div className="event-tags" style={{ marginTop: 16 }}>
            {event.categories.map((c) => (
              <span key={c} className="event-tag">
                {c}
              </span>
            ))}
          </div>
        )}

        <h1 className="blog-detail-title">{event.title}</h1>

        <div className="blog-author blog-detail-author">
          <div className="av">
            <div>📍</div>
          </div>
          <div className="who">
            <strong>{event.venue}</strong>
            <span>{locationLine}</span>
          </div>
        </div>

        <p className="blog-detail-content">{event.description}</p>

        <div className="event-detail-info">
          <div className="event-detail-info-row">
            <span>When</span>
            <strong>{formatEventWhen(event)}</strong>
          </div>
          <div className="event-detail-info-row">
            <span>Price</span>
            <strong>{formatPrice(event)}</strong>
          </div>
          {typeof event.spotsLeft === 'number' && (
            <div className="event-detail-info-row">
              <span>Spots left</span>
              <strong>{event.spotsLeft}</strong>
            </div>
          )}
          {event.attendeeCount > 0 && (
            <div className="event-detail-info-row">
              <span>Going</span>
              <strong>+{event.attendeeCount}</strong>
            </div>
          )}
        </div>

        {hasTiers && (
          <div className="event-tiers">
            <h2 className="event-tiers-heading">Ticket options</h2>
            {event.ticketTiers.map((tier) => {
              const left = Math.max((tier.totalSpots || 0) - (tier.spotsBooked || 0), 0);
              return (
                <div key={tier.id} className="event-tier-card">
                  <div className="event-tier-head">
                    <strong>{tier.name}</strong>
                    <span>₹{tier.price.toLocaleString('en-IN')}</span>
                  </div>
                  {tier.perks?.length > 0 && (
                    <ul className="event-tier-perks">
                      {tier.perks.map((perk, i) => (
                        <li key={i}>{perk}</li>
                      ))}
                    </ul>
                  )}
                  <span className="event-tier-spots">
                    {left} spot{left === 1 ? '' : 's'} left
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {event.organizerWebsite && (
          <a
            href={event.organizerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-block', marginTop: 8 }}
          >
            Book Now →
          </a>
        )}
      </div>
    </main>
  );
}