import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function useCertificates(eventId, subEventId) {
  const [loading, setLoading] = useState(true);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [meritStudents, setMeritStudents] = useState([]);

  useEffect(() => {
    if (eventId && subEventId) {
      fetchStudents();
    }
  }, [eventId, subEventId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // Fetch all registrations and winners in parallel
      const [registrationsResponse, leaderboardResponse] = await Promise.all([
        api.get(`/admin/events/${eventId}/registrations`),
        api.get(`/leaderboard/${eventId}`, {
          params: { subevent_id: subEventId },
        })
      ]);

      // Process winners first
      const subEventWinners = leaderboardResponse.data
        .filter(winner => winner.subevent_id === subEventId)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((winner, index) => ({
          ...winner,
          rank: index + 1,
        }));

      setMeritStudents(subEventWinners);

      // Get winner IDs for exclusion
      const winnerIds = new Set(subEventWinners.map(w => w.student_id));

      // Filter for participation certificates
      // Explicitly exclude winners and ensure payment and attendance criteria
      const participationStudents = registrationsResponse.data.filter(reg => 
        reg.subevent_id === parseInt(subEventId) &&
        reg.payment_status === 'paid' &&
        reg.attendance === true &&
        !winnerIds.has(reg.student_id) // Exclude winners using Set for O(1) lookup
      );

      setEligibleStudents(participationStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to fetch eligible students');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificates = async (formData) => {
    try {
      setLoading(true);
      const templateType = formData.get('templateType') || 'participation';

      // Validate based on certificate type
      if (templateType === 'merit') {
        if (meritStudents.length === 0) {
          throw new Error('No winners declared in leaderboard');
        }
        formData.append('winners', JSON.stringify(meritStudents));
      } else {
        if (eligibleStudents.length === 0) {
          throw new Error('No eligible students for participation certificates');
        }
        formData.append('participants', JSON.stringify(eligibleStudents));
      }

      const response = await api.post('/certificates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(`${templateType === 'merit' ? 'Merit' : 'Participation'} certificates generated successfully`);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate certificates');
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.error(error.message || 'Failed to generate certificates');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateCertificates,
    loading,
    eligibleStudents,
    meritStudents,
  };
}