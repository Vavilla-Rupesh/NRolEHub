import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function usePaidEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidRegistrations = async () => {
      try {
        const response = await api.get('/registrations/my-registrations');
        // Filter only paid registrations
        const paidRegistrations = response.data.filter(reg => reg.payment_status === 'paid');
        setRegistrations(paidRegistrations);
      } catch (error) {
        toast.error('Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchPaidRegistrations();
  }, []);

  return { registrations, loading };
}