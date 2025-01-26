import { useState, useEffect } from 'react';
import api from '../api';
import { API_ROUTES } from '../constants';
import toast from 'react-hot-toast';

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get(API_ROUTES.EVENTS.MY_REGISTRATIONS);
        setRegistrations(response.data);
      } catch (error) {
        setError(error.message);
        toast.error('Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const registerForEvent = async (eventId) => {
    try {
      const response = await api.post(API_ROUTES.EVENTS.REGISTER, { event_id: eventId });
      setRegistrations([...registrations, response.data]);
      toast.success('Successfully registered for event');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for event');
      throw error;
    }
  };

  return { registrations, loading, error, registerForEvent };
};