// lib/eventFormat.js
// Small display helpers shared between the public event card, event detail
// page, and (optionally) the admin list.

export function formatEventWhen(event) {
  if (!event?.eventDate) return '';
  const d = new Date(event.eventDate);
  const datePart = d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (!event.startTime) return datePart;
  const timePart = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime;

  return `${datePart} · ${timePart}`;
}

export function formatPrice(event) {
  if (!event) return '';
  if (event.isFree) return 'Free';

  if (event.ticketTiers && event.ticketTiers.length > 0) {
    const prices = event.ticketTiers.map((t) => Number(t.price) || 0);
    const min = Math.min(...prices);
    return `From ₹${min.toLocaleString('en-IN')}`;
  }

  if (event.price) {
    const unit = event.priceUnit === 'pair' ? '/ pair' : '/ person';
    return `₹${Number(event.price).toLocaleString('en-IN')} ${unit}`;
  }

  return 'Free';
}