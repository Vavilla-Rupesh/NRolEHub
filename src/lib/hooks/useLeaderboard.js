import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function useLeaderboard(eventId, subEventId) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (eventId && subEventId) {
      fetchLeaderboard();
    }
  }, [eventId, subEventId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leaderboard/${eventId}`, {
        params: { subevent_id: subEventId }
      });
      setLeaderboard(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch leaderboard');
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (scoreData) => {
    try {
      await api.put('/admin/leaderboard', {
        ...scoreData,
        event_id: eventId,
        subevent_id: subEventId
      });
      toast.success('Score updated successfully');
      await fetchLeaderboard(); // Refresh the leaderboard
    } catch (error) {
      toast.error('Failed to update score');
    }
  };

  return {
    leaderboard,
    loading,
    error,
    updateScore,
    refreshLeaderboard: fetchLeaderboard
  };
}