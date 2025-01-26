import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

function EventCard({ event }) {
  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold mb-4">{event.event_name}</h3>
      
      <div className="space-y-3 text-gray-600">
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
          <span>{formatDate(event.end_date)}</span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;