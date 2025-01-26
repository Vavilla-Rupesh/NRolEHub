import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

function EventList({ events }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/admin/events/${event.id}`}
          className="card hover:scale-105 transition-transform duration-300"
        >
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4">{event.event_name}</h3>
            
            <div className="space-y-3 text-gray-600 dark:text-gray-400 flex-grow">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.venue}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>
                  {formatDate(event.start_date)} - {formatDate(event.end_date)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <span className="text-primary font-medium">View Details →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default EventList;