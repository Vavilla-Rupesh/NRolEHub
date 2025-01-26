import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLeaderboard } from '../../../../lib/hooks/useLeaderboard';
import LoadingSpinner from '../../../shared/LoadingSpinner';

export default function LeaderboardManager({ eventId, subEventId }) {
  const { registrations, loading, updateScore } = useLeaderboard(eventId, subEventId);
  const [scores, setScores] = useState({});

  const handleScoreUpdate = async (registrationId) => {
    await updateScore({
      event_id: eventId,
      subevent_id: subEventId,
      registration_id: registrationId,
      score: scores[registrationId] || 0
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                    {registration.student_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    className="input w-24"
                    value={scores[registration.id] || ''}
                    onChange={(e) => setScores({
                      ...scores,
                      [registration.id]: parseInt(e.target.value) || 0
                    })}
                    min="0"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleScoreUpdate(registration.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Update Score
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}