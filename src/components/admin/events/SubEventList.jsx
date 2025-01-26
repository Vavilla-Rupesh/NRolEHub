import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, FileCheck, Download } from 'lucide-react';
import EmptyState from '../../shared/EmptyState';
import { toast } from 'react-toastify';
import api from '../../../lib/api' ;

function SubEventList({ subevents, eventId }) {
  const handleExportRegistrations = async () => {
    try {
      const response = await api.get(`/admin/events/${eventId}/export-registrations`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event_${eventId}_registrations.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Registrations exported successfully');
    } catch (error) {
      toast.error('Failed to export registrations');
    }
  };

  if (!eventId) {
    return (
      <EmptyState
        title="Invalid Event"
        message="Event ID is missing or invalid"
        icon={Users}
      />
    );
  }

  if (!subevents?.length) {
    return (
      <EmptyState
        title="No Sub-events"
        message="No sub-events available for this event"
        icon={Users}
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sub Events</h2>
        <button
          onClick={handleExportRegistrations}
          className="btn btn-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Registrations
        </button>
      </div>

      {subevents.map((subevent) => (
        <div key={subevent.id} className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{subevent.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {subevent.description}
              </p>
            </div>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold">
              ₹{subevent.fee}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            {subevent.id && (
              <>
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
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubEventList;
