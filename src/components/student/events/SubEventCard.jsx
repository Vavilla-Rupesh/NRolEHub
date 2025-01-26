import React, { useState } from 'react';
import { Users, Award, Download, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRegistration } from '../../../lib/hooks/useRegistration';
import { formatCurrency } from '../../../lib/utils';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

function SubEventCard({ subevent, eventId, onUpdate }) {
  const { user } = useAuth();
  const { handleRegistration, registering, isRegistered } = useRegistration(eventId, subevent.id);
  const [downloading, setDownloading] = useState(false);

  const handleRegister = () => {
    handleRegistration(
      {
        student_id: user.id,
        student_name: user.username,
        student_email: user.email,
        event_id: eventId,
        subevent_id: subevent.id,
        event_name: subevent.title,
        fee: subevent.fee,
      },
      onUpdate
    );
  };

  const handleDownloadResources = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      const response = await api.get(`/subevents/${subevent.id}/resources`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${subevent.title}_resources.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Resources downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resources');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{subevent.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{subevent.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 text-primary" />
              <span>{subevent.participants_count || 0} participants</span>
            </div>
            <div className="flex items-center space-x-1 text-primary font-bold">
              <span>{formatCurrency(subevent.fee)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={isRegistered ? null : handleRegister}
          disabled={registering}
          className={`btn ${isRegistered ? 'btn-success' : 'btn-primary'} flex-grow-[5]`}
        >
          <div className="flex items-center justify-center">
            {isRegistered ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registered
              </>
            ) : (
              registering ? 'Processing...' : 'Register Now'
            )}
          </div>
        </button>
        {subevent.has_resources && (
          <button
            onClick={handleDownloadResources}
            disabled={downloading}
            className="btn btn-secondary flex-grow"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Downloading...' : 'Resources'}
          </button>
        )}
      </div>
    </div>
  );
}

export default SubEventCard;
