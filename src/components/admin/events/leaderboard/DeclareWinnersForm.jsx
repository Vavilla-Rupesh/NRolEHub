import React, { useState } from 'react';
import { Trophy, AlertCircle } from 'lucide-react';
import { LeaderboardService } from '../../../../lib/services/leaderboard.service';
import toast from 'react-hot-toast';

export default function DeclareWinnersForm({ eventId, subEventId, registrations, onSuccess }) {
  const [winners, setWinners] = useState(Array(5).fill({ registration_id: '', score: '' }));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWinners()) {
      toast.error('Please fill in all winner details');
      return;
    }

    try {
      setSubmitting(true);
      await LeaderboardService.declareWinners(eventId, subEventId, winners);
      toast.success('Winners declared successfully');
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validateWinners = () => {
    return winners.every((winner, index) => {
      if (index < 3) { // First 3 positions are mandatory
        return winner.registration_id && winner.score;
      }
      return true;
    });
  };

  const updateWinner = (index, field, value) => {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <p className="text-yellow-700 dark:text-yellow-300">
            Declaring winners will finalize the leaderboard. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {winners.map((winner, index) => (
          <div key={index} className="glass-card">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className={`h-6 w-6 ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-600' :
                'text-gray-300'
              }`} />
              <h3 className="text-lg font-semibold">Position {index + 1}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select
                  className="input w-full"
                  value={winner.registration_id}
                  onChange={(e) => updateWinner(index, 'registration_id', e.target.value)}
                  required={index < 3}
                >
                  <option value="">Select student</option>
                  {registrations.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.student_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Score</label>
                <input
                  type="number"
                  className="input w-full"
                  value={winner.score}
                  onChange={(e) => updateWinner(index, 'score', e.target.value)}
                  required={index < 3}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full"
      >
        {submitting ? 'Declaring Winners...' : 'Declare Winners'}
      </button>
    </form>
  );
}