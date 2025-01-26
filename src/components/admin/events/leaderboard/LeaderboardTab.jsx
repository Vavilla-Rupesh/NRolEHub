import React, { useState } from 'react';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function LeaderboardTab({ eventId, subEventId, registrations }) {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUpdateScore = async (registrationId) => {
    try {
      setLoading(true);
      await api.put('/admin/leaderboard', {
        event_id: eventId,
        subevent_id: subEventId,
        registration_id: registrationId,
        score: scores[registrationId] || 0
      });
      toast.success('Score updated successfully');
    } catch (error) {
      toast.error('Failed to update score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {registrations?.map((registration, index) => (
              <tr key={registration.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Trophy className={`w-5 h-5 mr-2 ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      'text-gray-300'
                    }`} />
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
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
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateScore(registration.id)}
                    disabled={loading}
                    className="btn btn-sm btn-primary"
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