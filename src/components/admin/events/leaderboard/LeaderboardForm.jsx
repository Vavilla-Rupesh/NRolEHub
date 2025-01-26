import React, { useState } from 'react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

function LeaderboardForm({ eventId, subEventId, registrationId, onSuccess }) {
  const [formData, setFormData] = useState({
    event_id: eventId,
    subevent_id: subEventId,
    registration_id: registrationId,
    score: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/leaderboard', formData);
      toast.success('Leaderboard updated successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to update leaderboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Score</label>
        <input
          type="number"
          className="input"
          value={formData.score}
          onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
          min="0"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Update Score
      </button>
    </form>
  );
}

export default LeaderboardForm;