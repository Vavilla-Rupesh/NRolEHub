import React from 'react';
import SubEventCard from './SubEventCard';
import { Download } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

function SubEventList({ subevents, eventId, onUpdate, event }) {

       return( 
        <div className="space-y-6">
          {subevents.map((subevent) => (
            <SubEventCard
              key={subevent.id}
              subevent={subevent}
              eventId={eventId}
              onUpdate={onUpdate}
              event={event}
            />
          ))}

      {/* Right side - Event Image */}
      {event?.event_image && (
        <div className="hidden md:block md:col-span-5 sticky top-24">
          <div className="glass-card overflow-hidden">
            <img
              src={event.event_image}
              alt={event.event_name}
              className="w-full h-auto rounded-lg object-cover transform transition-transform duration-300 hover:scale-105"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{event.event_name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubEventList;