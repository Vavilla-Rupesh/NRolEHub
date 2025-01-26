import React from 'react';
import { usePaidEvents } from '../../../../lib/hooks/usePaidEvents';
import PaidEventCard from './PaidEventCard';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import EmptyState from '../../../shared/EmptyState';
import { Calendar } from 'lucide-react';

function PaidEventsList({ searchTerm = '' }) {
  const { registrations, loading } = usePaidEvents();

  if (loading) return <LoadingSpinner />;

  // Filter registrations based on subevent name if searchTerm is provided
  const filteredRegistrations = searchTerm
    ? registrations.filter(reg => 
        reg.subevent_title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : registrations;

  if (!filteredRegistrations.length) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Events Found"
        message={searchTerm ? "No events match your search" : "You haven't registered for any events yet."}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRegistrations.map((registration) => (
        <PaidEventCard key={registration.id} registration={registration} />
      ))}
    </div>
  );
}

export default PaidEventsList;