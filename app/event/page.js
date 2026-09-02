import EventsSection from '@/components/EventsSection';

export const metadata = {
  title: 'Events — Strange In',
  description: 'Upcoming meetups, mixers, and get-togethers for the Strange In community.',
};

export default function EventsPage() {
  return (
    <main>
      <EventsSection />
    </main>
  );
}