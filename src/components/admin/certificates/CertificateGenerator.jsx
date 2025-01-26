import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function CertificateGenerator({ eventId, subEventId, template, positions }) {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchParticipants();
    fetchWinners();
  }, [eventId, subEventId]);

  const fetchParticipants = async () => {
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      const validParticipants = response.data.filter(
        reg => reg.subevent_id === subEventId && 
              reg.payment_status === 'paid' && 
              reg.attendance
      );
      setParticipants(validParticipants);
    } catch (error) {
      toast.error('Failed to fetch participants');
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await api.get(`/leaderboard/${eventId}`, {
        params: { subevent_id: subEventId }
      });
      setWinners(response.data);
    } catch (error) {
      toast.error('Failed to fetch winners');
    }
  };

  const generateCertificates = async () => {
    try {
      setGenerating(true);
      const formData = new FormData();
      formData.append('template', template);
      formData.append('positions', JSON.stringify(positions));
      formData.append('eventId', eventId);
      formData.append('subEventId', subEventId);

      await api.post('/certificates/generate', formData);
      toast.success('Certificates generated successfully');
    } catch (error) {
      toast.error('Failed to generate certificates');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Certificate Generation</h2>
          <p className="text-gray-600 mt-1">
            {participants.length} participants eligible for certificates
          </p>
        </div>
        <button
          onClick={generateCertificates}
          disabled={generating}
          className="btn btn-primary"
        >
          <Download className="h-4 w-4 mr-2" />
          {generating ? 'Generating...' : 'Generate Certificates'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          <div className="space-y-2">
            {participants.map(participant => (
              <div key={participant.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                <div>
                  <p className="font-medium">{participant.student_name}</p>
                  <p className="text-sm text-gray-600">{participant.student_email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Winners</h3>
          <div className="space-y-2">
            {winners.map((winner, index) => (
              <div key={winner.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                <div>
                  <p className="font-medium">{winner.student_name}</p>
                  <p className="text-sm text-gray-600">Rank: {index + 1}</p>
                </div>
                <span className="font-bold">{winner.score} points</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}