import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWinners } from '../../../../lib/hooks/useWinners';
import { LeaderboardService } from '../../../../lib/services/leaderboard.service';
import TopWinners from '../../../shared/leaderboard/TopWinners';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import EmptyState from '../../../shared/EmptyState';
import { Trophy, Search, X, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../lib/api';

export default function LeaderboardManager() {
  const { eventId, subEventId } = useParams();
  const { winners, loading, refreshWinners } = useWinners(parseInt(eventId), parseInt(subEventId));
  const [declaring, setDeclaring] = useState(false);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([
    { position: 1, student_id: '', score: '', student_name: '' },
    { position: 2, student_id: '', score: '', student_name: '' },
    { position: 3, student_id: '', score: '', student_name: '' }
  ]);

  useEffect(() => {
    if (showWinnerSelection) {
      fetchParticipants();
    }
  }, [showWinnerSelection, eventId, subEventId]);

  useEffect(() => {
    if (winners.length > 0) {
      setSelectedWinners(winners.map(winner => ({
        position: winner.rank,
        student_id: winner.student_id,
        student_name: winner.student_name,
        student_email: winner.student_email,
        score: winner.score
      })));
    }
  }, [winners]);

  const fetchParticipants = async () => {
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      const validParticipants = response.data.filter(
        reg => reg.subevent_id === parseInt(subEventId) && 
              reg.payment_status === 'paid' && 
              reg.attendance
      );
      setParticipants(validParticipants);
    } catch (error) {
      toast.error('Failed to fetch participants');
    }
  };

  const filteredParticipants = participants.filter(participant =>
    participant.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectWinner = (position, participant) => {
    setSelectedWinners(prev => prev.map(w => 
      w.position === position ? {
        ...w,
        student_id: participant.student_id,
        student_name: participant.student_name,
        student_email: participant.student_email
      } : w
    ));
  };

  const handleScoreChange = (position, score) => {
    setSelectedWinners(prev => prev.map(w =>
      w.position === position ? { ...w, score: parseInt(score) || 0 } : w
    ));
  };

  const handleDeclareWinners = async () => {
    const invalidSelections = selectedWinners.filter(w => !w.student_id || !w.score);
    if (invalidSelections.length > 0) {
      toast.error('Please select winners and assign scores for all positions');
      return;
    }

    try {
      setDeclaring(true);
      const winnersData = selectedWinners.map(winner => ({
        student_id: winner.student_id,
        score: winner.score,
        position: winner.position
      }));

      await LeaderboardService.declareWinners(
        parseInt(eventId),
        parseInt(subEventId),
        winnersData
      );

      toast.success('Winners declared successfully!');
      setShowWinnerSelection(false);
      await refreshWinners();
    } catch (error) {
      console.error('Error declaring winners:', error);
      toast.error('Failed to declare winners. Please try again.');
    } finally {
      setDeclaring(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {!showWinnerSelection && (
        <div className="flex justify-end space-x-4">
          {winners.length > 0 ? (
            <button
              onClick={() => setShowWinnerSelection(true)}
              className="btn btn-secondary flex items-center"
            >
              <Edit2 className="h-5 w-5 mr-2" />
              Edit Winners
            </button>
          ) : (
            <button
              onClick={() => setShowWinnerSelection(true)}
              className="btn btn-primary flex items-center"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Declare Winners
            </button>
          )}
        </div>
      )}

      {showWinnerSelection && (
        <div className="glass-card space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {winners.length > 0 ? 'Edit Winners' : 'Select Winners'}
            </h2>
            <button
              onClick={() => setShowWinnerSelection(false)}
              className="btn btn-ghost p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search participants..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {selectedWinners.map((winner) => (
              <div key={winner.position} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="font-medium">{winner.position}st Place</span>
                </div>
                <div className="flex-1">
                  <select
                    className="input w-full"
                    value={winner.student_id}
                    onChange={(e) => {
                      const participant = participants.find(p => p.student_id === parseInt(e.target.value));
                      if (participant) {
                        handleSelectWinner(winner.position, participant);
                      }
                    }}
                  >
                    <option value="">Select participant</option>
                    {filteredParticipants.map((participant) => (
                      <option key={participant.student_id} value={participant.student_id}>
                        {participant.student_name} ({participant.student_email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    placeholder="Score"
                    className="input w-full"
                    value={winner.score}
                    onChange={(e) => handleScoreChange(winner.position, e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDeclareWinners}
              disabled={declaring}
              className="btn btn-primary"
            >
              {declaring ? 'Saving...' : (winners.length > 0 ? 'Update Winners' : 'Confirm Winners')}
            </button>
          </div>
        </div>
      )}

      {winners?.length > 0 && !showWinnerSelection && (
        <div className="max-w-2xl mx-auto">
          <TopWinners winners={winners} />
        </div>
      )}

      {!winners?.length && !showWinnerSelection && (
        <EmptyState
          icon={Trophy}
          title="No Winners Yet"
          message="Winners haven't been declared for this event"
        />
      )}
    </div>
  );
}