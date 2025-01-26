import { useState, useEffect } from 'react';
import api from '../api';
import { API_ROUTES } from '../constants';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export const useEvents = (page = 1, limit = 10) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(API_ROUTES.EVENTS.LIST, {
          params: { page, limit }
        });
        
        setEvents(response.data.rows);
        setTotalPages(Math.ceil(response.data.count / limit));
      } catch (error) {
        setError(error.message);
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, limit]);

  return { events, loading, error, totalPages };
};