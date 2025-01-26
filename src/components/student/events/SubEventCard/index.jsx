import React from 'react';
import { Users } from 'lucide-react';
import SubEventHeader from './SubEventHeader';
import RegistrationButton from './RegistrationButton';

function SubEventCard({ subevent, eventId, onUpdate }) {
  return (
    <div className="glass-card">
      <SubEventHeader 
        title={subevent.title} 
        description={subevent.description} 
        fee={subevent.fee} 
      />

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Users className="h-5 w-5 text-primary" />
          <span>{subevent.participants_count || 0} participants</span>
        </div>
      </div>

      <RegistrationButton 
        subevent={subevent} 
        eventId={eventId} 
        onUpdate={onUpdate} 
      />
    </div>
  );
}

export default SubEventCard;