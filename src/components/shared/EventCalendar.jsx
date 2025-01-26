import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';

function EventCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events
        const eventsResponse = await api.get('/events');
        setEvents(eventsResponse.data.rows || []);

        // Fetch user's registrations if logged in
        if (user) {
          const registrationsResponse = await api.get('/registrations/my-registrations');
          // Only consider paid registrations
          const paidRegistrations = registrationsResponse.data.filter(reg => reg.payment_status === 'paid');
          setRegistrations(paidRegistrations);
        }
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
        toast.error('Failed to load events');
      }
    };

    fetchData();
  }, [user]);

  const handleDateClick = async (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Find events on this date
    const eventsOnDate = events.filter(event => {
      const eventStart = format(new Date(event.start_date), 'yyyy-MM-dd');
      const eventEnd = format(new Date(event.end_date), 'yyyy-MM-dd');
      return formattedDate >= eventStart && formattedDate <= eventEnd;
    });

    // Find registrations on this date
    const registrationsOnDate = registrations.filter(reg => {
      const event = events.find(e => e.id === reg.event_id);
      if (!event) return false;
      const eventStart = format(new Date(event.start_date), 'yyyy-MM-dd');
      const eventEnd = format(new Date(event.end_date), 'yyyy-MM-dd');
      return formattedDate >= eventStart && formattedDate <= eventEnd;
    });

    if (registrationsOnDate.length > 0) {
      // Get subevent details for the registrations
      try {
        const subeventsPromises = registrationsOnDate.map(reg =>
          api.get(`/subevents/${reg.event_id}`).then(res => res.data.subevents)
        );
        const subeventsList = await Promise.all(subeventsPromises);
        const subevents = subeventsList.flat().filter(Boolean);

        // Navigate to my-events with subevent filter
        navigate('/student/my-events', { 
          state: { 
            filteredSubevents: subevents.map(sub => sub.title)
          }
        });
      } catch (error) {
        console.error('Failed to fetch subevents:', error);
        toast.error('Failed to load event details');
      }
    } else if (eventsOnDate.length > 0) {
      // Navigate to events page with event filter
      navigate('/student/events', { 
        state: { 
          filteredEventIds: eventsOnDate.map(event => event.id)
        }
      });
    }
  };

  const getDateStatus = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    let hasEvent = false;
    let isRegistered = false;

    // Check for events on this date
    for (const event of events) {
      const eventStart = format(new Date(event.start_date), 'yyyy-MM-dd');
      const eventEnd = format(new Date(event.end_date), 'yyyy-MM-dd');
      
      if (formattedDate >= eventStart && formattedDate <= eventEnd) {
        hasEvent = true;
        
        // Check if registered for this event
        const registration = registrations.find(reg => reg.event_id === event.id);
        if (registration) {
          isRegistered = true;
          break;
        }
      }
    }

    return { hasEvent, isRegistered };
  };

  const tileClassName = ({ date }) => {
    const { hasEvent, isRegistered } = getDateStatus(date);
    
    return cn(
      'rounded-lg transition-all duration-200',
      hasEvent && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
      isRegistered && 'text-primary font-bold'
    );
  };

  const tileContent = ({ date }) => {
    const { hasEvent, isRegistered } = getDateStatus(date);

    if (hasEvent || isRegistered) {
      return (
        <div className="flex justify-center mt-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isRegistered ? "bg-primary" : "bg-gray-400"
          )} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card">
      <Calendar
        onChange={handleDateClick}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="w-full border-none shadow-none bg-transparent"
        locale="en-US"
      />
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span>Available Event</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Registered Event</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCalendar;