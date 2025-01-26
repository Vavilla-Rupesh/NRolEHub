import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Award, FileCheck } from 'lucide-react';
import AttendanceManager from './attendance/AttendanceManager';
import LeaderboardManager from './leaderboard/LeaderboardManager';
import CertificateManager from './certificates/CertificateManager';
import LoadingSpinner from '../../shared/LoadingSpinner';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

function SubEventDetails() {
  const { eventId, subEventId } = useParams();
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [subEvent, setSubEvent] = useState(null);

  useEffect(() => {
    const fetchSubEventDetails = async () => {
      try {
        const response = await api.get(`/subevents/${eventId}`);
        const foundSubEvent = response.data.subevents?.find(
          se => se.id === parseInt(subEventId)
        );
        if (!foundSubEvent) {
          throw new Error('Subevent not found');
        }
        setSubEvent(foundSubEvent);
      } catch (error) {
        toast.error('Failed to fetch subevent details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId && subEventId) {
      fetchSubEventDetails();
    }
  }, [eventId, subEventId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{subEvent?.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Users className="h-5 w-5 mr-2" />
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Award className="h-5 w-5 mr-2" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`btn ${activeTab === 'certificates' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <FileCheck className="h-5 w-5 mr-2" />
            Certificates
          </button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <AttendanceManager 
          eventId={parseInt(eventId)} 
          subEventId={parseInt(subEventId)} 
        />
      )}

      {activeTab === 'leaderboard' && (
        <LeaderboardManager 
          eventId={parseInt(eventId)} 
          subEventId={parseInt(subEventId)} 
        />
      )}

      {activeTab === 'certificates' && (
        <CertificateManager 
          eventId={parseInt(eventId)} 
          subEventId={parseInt(subEventId)} 
        />
      )}
    </div>
  );
}

export default SubEventDetails;