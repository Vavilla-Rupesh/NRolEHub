import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function useWinners(eventId, subEventId) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId && subEventId) {
      fetchWinners();
    }
  }, [eventId, subEventId]);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      // Add subevent_id as a query parameter
      const response = await api.get(`/leaderboard/${eventId}`, {
        params: { subevent_id: subEventId }
      });
      
      // Filter winners for this specific subevent
      const subEventWinners = response.data.filter(
        winner => winner.subevent_id === subEventId
      );
      
      // Sort by score and get top 3
      const topWinners = subEventWinners
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((winner, index) => ({
          ...winner,
          rank: index + 1
        }));

      setWinners(topWinners);
    } catch (error) {
      toast.error('Failed to fetch winners');
    } finally {
      setLoading(false);
    }
  };

  return { winners, loading, refreshWinners: fetchWinners };
}