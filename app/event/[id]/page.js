import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/eventsApi';
import LikeButton from '@/components/LikeButton';

export async function generateMetadata({ params }) {
  const event = await getEventById(params.id);
  if (!event) return { title: 'Event not found — Strange In' };
  return { title: `${event.title} — Strange In`, description: event.description };
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default async function EventDetailPage({ params }) {
  const event = await getEventById(params.id);
  if (!event) notFound();

  return (
    <main className="blog-detail">
      <div className="blog-detail-inner">
        <Link href="/events" className="btn-ghost blog-back">← Back to events</Link>

        <div className={`blog-detail-hero ${event.image ? '' : 'grad g1'}`}>
          {event.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.image} alt={event.title} className="blog-detail-photo" />
          )}
          <span className="blog-cat">{formatEventDate(event.eventDate)}</span>
        </div>

        <h1 className="blog-detail-title">{event.title}</h1>

        <div className="blog-author blog-detail-author">
          <div className="av"><div>📍</div></div>
          <div className="who">
            <strong>{event.location}</strong>
            <span>{event.organizer}</span>
          </div>
        </div>

        <p className="blog-detail-content">{event.description}</p>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-block', marginTop: 8 }}
          >
            Register / Learn more →
          </a>
        )}

        <div className="blog-detail-footer">
          <LikeButton
            id={event.id}
            initialLikes={event.likes}
            className="blog-like blog-like-standalone"
            endpoint="events"
            resourceKey="event"
          />
        </div>
      </div>
    </main>
  );
}