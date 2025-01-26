import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import api from '../../../lib/api';
import SubEventList from './SubEventList';
import CreateSubEventModal from './subevents/CreateSubEventModal';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { formatDate } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [subevents, setSubevents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventResponse, subeventsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/subevents/${id}`)
      ]);

      setEvent(eventResponse.data);
      setSubevents(subeventsResponse.data.subevents || []);
    } catch (error) {
      toast.error('Failed to fetch event details');
      if (error.response?.status === 403) {
        navigate('/admin/events');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{event?.event_name}</h1>
          <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
            {event?.venue}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{event?.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Starts: {formatDate(event?.start_date)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-5 w-5 text-primary" />
              <span>Ends: {formatDate(event?.end_date)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
            <p className="text-gray-600 dark:text-gray-300">{event?.eligibility_criteria}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sub Events</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Sub-event
        </button>
      </div>

      <SubEventList 
        subevents={subevents} 
        eventId={id} 
        onUpdate={fetchEventDetails} 
      />

      <CreateSubEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventId={id}
        onSubEventCreated={fetchEventDetails}
      />
    </div>
  );
}
export default EventDetails;