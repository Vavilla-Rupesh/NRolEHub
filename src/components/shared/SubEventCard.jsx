import React from 'react';
import { Award, Users, Clock } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

function SubEventCard({ subevent, onRegister, isRegistered }) {
  return (
    <div className="glass-card hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {subevent.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{subevent.description}</p>
        </div>
        <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold">
          {formatCurrency(subevent.fee)}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
          <Users className="h-5 w-5 text-primary" />
          <span>{subevent.participants_count || 0} participants</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
          <Clock className="h-5 w-5 text-primary" />
          <span>Registration {subevent.registration_open ? 'Open' : 'Closed'}</span>
        </div>
      </div>

      {isRegistered ? (
        <div className="flex space-x-3">
          <button className="btn btn-secondary flex-1">
            <Award className="h-4 w-4 mr-2" />
            View Leaderboard
          </button>
          {subevent.certificate_Generated && (
            <button className="btn btn-primary flex-1">
              Download Certificate
            </button>
          )}
        </div>
      ) : (
        <button 
          onClick={onRegister}
          className="btn btn-primary w-full"
        >
          Register Now
        </button>
      )}
    </div>
  );
}