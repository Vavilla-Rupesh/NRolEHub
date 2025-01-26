import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { formatDate } from '../../lib/utils';

function EventCard({ event }) {
  return (
    <div className="glass-card group hover:scale-105 transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl -mx-6 -mt-6 mb-6">
        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {event.event_name}
      </h3>
      
      <div className="space-y-3 text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{formatDate(event.start_date)}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span>{event.venue}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-primary" />
          <span>{formatDate(event.end_date)}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-primary" />
          <span>{event.registered_count || 0} registered</span>
        </div>
      </div>
    </div>
  );
}