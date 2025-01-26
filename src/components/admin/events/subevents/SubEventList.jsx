import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, FileCheck } from 'lucide-react';

function SubEventList({ subevents, eventId }) {
  return (
    <div className="grid gap-6">
      {subevents.map((subevent) => (
        <div key={subevent.id} className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{subevent.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{subevent.description}</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold">
              ₹{subevent.fee}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to={`/admin/events/${eventId}/subevents/${subevent.id}/attendance`}
              className="btn btn-secondary"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Attendance
            </Link>

            <Link
              to={`/admin/events/${eventId}/subevents/${subevent.id}/leaderboard`}
              className="btn btn-secondary"
            >
              <Award className="h-4 w-4 mr-2" />
              Manage Leaderboard
            </Link>

            <Link
              to={`/admin/events/${eventId}/subevents/${subevent.id}/certificates`}
              className="btn btn-secondary"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Manage Certificates
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubEventList;