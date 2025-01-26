import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import api from '../../../lib/api';
import SubEventList from './SubEventList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { formatDate } from '../../../lib/utils';
import toast from 'react-hot-toast';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [subevents, setSubevents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 h-[500px]">
        {/* Event Image */}
        <div className="glass-card h-full p-0 overflow-hidden">
          <img
            src={event?.event_image}
            alt={event?.event_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="glass-card h-full overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{event?.event_name}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mt-2">
                <Tag className="h-4 w-4 mr-2" />
                {event?.nature_of_activity}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary">
              IQAC: {event?.iqac_reference}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">{event?.description}</p>

            <div className="grid gap-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Starts: {formatDate(event?.start_date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-5 w-5 text-primary" />
                <span>Ends: {formatDate(event?.end_date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{event?.venue}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
              <p className="text-gray-600 dark:text-gray-300">{event?.eligibility_criteria}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sub Events</h2>
        <SubEventList subevents={subevents} eventId={id} onUpdate={fetchEventDetails} />
      </div>
    </div>
  );
}

export default EventDetails;