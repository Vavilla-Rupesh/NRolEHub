import api from '../api';

export const LeaderboardService = {
  async declareWinners(eventId, subEventId, winners) {
    try {
      const response = await api.post('/leaderboard/winners', {
        eventId,
        subEventId,
        winners: winners.map(winner => ({
          student_id: winner.student_id,
          score: winner.score,
          position: winner.position
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error declaring winners:', error);
      throw new Error(error.response?.data?.message || 'Failed to declare winners');
    }
  },

  async getLeaderboard(eventId, subEventId) {
    try {
      const response = await api.get(`/leaderboard/${eventId}`, {
        params: { subevent_id: subEventId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
};