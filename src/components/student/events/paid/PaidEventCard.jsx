import React, { useState, useEffect } from 'react';
import { Calendar, Award, Download, CheckCircle, Users } from 'lucide-react';
import { formatDate } from '../../../../lib/utils';
import { useWinners } from '../../../../lib/hooks/useWinners';
import WinnersModal from '../../../shared/Modal/WinnersModal';
import toast from 'react-hot-toast';
import { useCertificateDownload } from '../../../../lib/hooks/useCertificateDownload';
function PaidEventCard({ registration }) {
  const [showWinners, setShowWinners] = useState(false);
  const { winners, loading } = useWinners(registration.event_id, registration.subevent_id);
  const [isWinner, setIsWinner] = useState(false);
  const { downloadCertificate, downloading } = useCertificateDownload();
  const [winnerRank, setWinnerRank] = useState(null);

  useEffect(() => {
    const winner = winners.find(w => w.student_id === registration.student_id);
    setIsWinner(!!winner);
    if (winner) {
      setWinnerRank(winner.rank);
    }
  }, [winners, registration.student_id]);

  const handleDownloadCertificate = async () => {
    if (downloading) return;

    try {
      await downloadCertificate(
        registration.event_id,
        registration.subevent_id
      );
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{registration.event_name}</h3>
          {registration.subevent_id && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sub-event
            </span>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 text-primary" />
              <span>Registered</span>
            </div>
            {registration.attendance && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Attendance Marked
              </span>
            )}
            {isWinner && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Award className="h-3 w-3 mr-1" />
                {winnerRank}{winnerRank === 1 ? 'st' : winnerRank === 2 ? 'nd' : 'rd'} Place
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Registered on {formatDate(registration.registration_date)}</span>
        </div>
      </div>

      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => setShowWinners(true)}
          className="btn btn-secondary flex-1"
          disabled={loading}
        >
          <Award className="h-4 w-4 mr-2" />
          View Leaderboard
        </button>
        
        <button
          onClick={handleDownloadCertificate}
          disabled={downloading}
          className="btn btn-primary flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Downloading...' : `Download ${isWinner ? 'Merit' : 'Participation'} Certificate`}
        </button>
      </div>

      <WinnersModal 
        isOpen={showWinners}
        onClose={() => setShowWinners(false)}
        winners={winners}
        subEventId={registration.subevent_id}
      />
    </div>
  );
}

export default PaidEventCard;