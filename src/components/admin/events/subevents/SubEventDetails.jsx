import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Award, FileCheck } from 'lucide-react';
import api from '../../../../lib/api';
import AttendanceTable from '../attendance/AttendanceTable';
import LeaderboardForm from '../leaderboard/LeaderboardForm';
import CertificateUpload from '../certificates/CertificateUpload';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import toast from 'react-hot-toast';

function SubEventDetails() {
  const { eventId, subEventId } = useParams();
  const [subEvent, setSubEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('registrations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubEventDetails();
  }, [eventId, subEventId]);

  const fetchSubEventDetails = async () => {
    try {
      const [subEventResponse, registrationsResponse] = await Promise.all([
        api.get(`/subevents/${eventId}/${subEventId}`),
        api.get(`/admin/events/${eventId}/registrations`)
      ]);
      setSubEvent(subEventResponse.data);
      setRegistrations(registrationsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch sub-event details');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = async (registrationId) => {
    try {
      await api.put(`/admin/mark-attendance/${registrationId}`);
      toast.success('Attendance marked successfully');
      fetchSubEventDetails();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{subEvent?.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Users className="h-5 w-5 mr-2" />
            Registrations
          </button>
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

      {activeTab === 'registrations' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Registered Students</h2>
          <AttendanceTable 
            registrations={registrations} 
            onAttendanceUpdate={handleAttendanceUpdate}
          />
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>
          <AttendanceTable 
            registrations={registrations} 
            onAttendanceUpdate={handleAttendanceUpdate}
          />
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Update Leaderboard</h2>
          <LeaderboardForm 
            eventId={eventId} 
            subEventId={subEventId} 
            registrations={registrations}
          />
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Generate Certificates</h2>
          <CertificateUpload 
            eventId={eventId}
            subEventId={subEventId}
            registrations={registrations}
          />
        </div>
      )}
    </div>
  );
}

export default SubEventDetails;