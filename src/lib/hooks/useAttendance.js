import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function useAttendance(eventId, subEventId) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    if (typeof eventId === 'number' && typeof subEventId === 'number') {
      fetchRegistrations();
    } else {
      setError('Invalid event or subevent ID');
      setLoading(false);
    }
  }, [eventId, subEventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      
      const validRegistrations = response.data.filter(
        reg => reg && reg.subevent_id === subEventId && reg.payment_status === 'paid'
      );
      
      setRegistrations(validRegistrations);
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch registrations';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (registrationId, present = true) => {
    if (!registrationId) {
      toast.error('Invalid registration ID');
      return;
    }

    try {
      const response = await api.put(`/admin/mark-attendance/${registrationId}`, { present });
      
      if (response.data.success) {
        // Update local state
        setRegistrations(prevRegistrations => 
          prevRegistrations.map(reg => 
            reg.id === registrationId 
              ? { ...reg, attendance: present }
              : reg
          )
        );

        toast.success(`Attendance marked as ${present ? 'present' : 'absent'}`);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(errorMessage);
      throw error;
    }
  };

  const markBulkAttendance = async (present = false) => {
    try {
      setBulkUpdating(true);
      const response = await api.put(
        `/admin/events/${eventId}/subevents/${subEventId}/bulk-attendance`,
        { present }
      );
      
      if (response.data.success) {
        // Update local state with the returned registrations
        setRegistrations(response.data.registrations);
        toast.success(`All students marked as ${present ? 'present' : 'absent'}`);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update attendance';
      toast.error(errorMessage);
    } finally {
      setBulkUpdating(false);
    }
  };

  const toggleAttendance = async (registrationId, currentStatus) => {
    await markAttendance(registrationId, !currentStatus);
  };

  return {
    registrations,
    loading,
    error,
    bulkUpdating,
    markAttendance,
    toggleAttendance,
    markBulkAttendance,
    refreshRegistrations: fetchRegistrations
  };
}