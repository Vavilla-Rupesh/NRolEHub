import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../shared/LoadingSpinner';
import toast from 'react-hot-toast';

function StudentHome() {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsByDate, setPointsByDate] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's registered events
      const registrationsResponse = await api.get('/registrations/my-registrations');
      const registrations = registrationsResponse.data.filter(reg => reg.payment_status === 'paid');

      // Fetch leaderboard data for all events
      const leaderboardPromises = registrations.map(reg => 
        api.get(`/leaderboard/${reg.event_id}`, {
          params: { subevent_id: reg.subevent_id }
        }).catch(() => ({ data: [] }))
      );
      const leaderboardResponses = await Promise.all(leaderboardPromises);

      // Create a map of event winners
      const winnersMap = new Map();
      leaderboardResponses.forEach((response, index) => {
        const reg = registrations[index];
        const winners = response.data;
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const userRank = winners.find(w => w.student_id === user.id)?.rank;
        if (userRank) {
          winnersMap.set(eventKey, userRank);
        }
      });

      // Enhance registrations with rank data
      const enhancedRegistrations = registrations.map(reg => {
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const rank = winnersMap.get(eventKey);
        return { ...reg, rank };
      });

      // Calculate points
      const { total, pointsByDate } = calculatePointsByDate(enhancedRegistrations);
      setTotalPoints(total);
      setPointsByDate(pointsByDate);
      setRegisteredEvents(enhancedRegistrations);

      // Fetch upcoming events
      const eventsResponse = await api.get('/events');
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const upcoming = eventsResponse.data.rows
        .filter(event => new Date(event.start_date) >= now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);
      
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePointsByDate = (registrations) => {
    // Group registrations by date
    const eventsByDate = registrations.reduce((acc, reg) => {
      const date = new Date(reg.registration_date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reg);
      return acc;
    }, {});

    let totalPoints = 0;
    const pointsByDate = {};

    // Process each date
    Object.entries(eventsByDate).forEach(([date, regs]) => {
      // Calculate points for each registration
      const eventPoints = regs.map(reg => ({
        ...reg,
        points: reg.rank ? 3 : (reg.attendance ? 2 : 0),
        type: reg.rank ? `${reg.rank}${getRankSuffix(reg.rank)} Place` : (reg.attendance ? 'Participation' : 'Registered')
      }));

      // Sort by points and take top 2
      const topEvents = eventPoints
        .sort((a, b) => b.points - a.points)
        .slice(0, 2);

      // Sum points for this date
      const datePoints = topEvents.reduce((sum, event) => sum + event.points, 0);
      totalPoints += datePoints;

      pointsByDate[date] = {
        events: topEvents,
        totalPoints: datePoints
      };
    });

    return { total: totalPoints, pointsByDate };
  };

  const getRankSuffix = (rank) => {
    if (!rank) return '';
    if (rank >= 11 && rank <= 13) return 'th';
    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card bg-gradient-to-r from-primary/10 to-primary-dark/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-gray-600 dark:text-gray-300">
              You have registered for {registeredEvents.length} events
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-primary/20 px-4 py-2 rounded-lg">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-medium">{totalPoints} points</span>
          </div>
        </div>
      </div>

      {/* Points Breakdown */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Points Breakdown</h2>
        <div className="space-y-6">
          {Object.entries(pointsByDate).map(([date, { events, totalPoints }]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-medium text-gray-600">{formatDate(new Date(date))}</h3>
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">{event.event_name}</h4>
                      <span className={`text-sm ${
                        event.rank ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <span className="font-bold text-primary">{event.points} points</span>
                  </div>
                ))}
                <div className="flex justify-end pt-2 text-sm font-medium text-gray-600">
                  Day Total: {totalPoints} points
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Points</span>
              <span className="font-bold text-lg text-primary">{totalPoints}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Points are calculated from your top 2 events per day
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <Link to="/student/events" className="text-primary hover:text-primary/80">
            View all
          </Link>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {upcomingEvents.map((event) => {
            const isRegistered = registeredEvents.some(reg => reg.event_id === event.id);
            const startDate = new Date(event.start_date);
            const isToday = new Date().toDateString() === startDate.toDateString();
            
            return (
              <Link
                key={event.id}
                to={`/student/events/${event.id}`}
                className="block py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    isToday 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                      : 'bg-primary/10'
                  }`}>
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{event.event_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.start_date)}
                      {isToday && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                          Today
                        </span>
                      )}
                    </p>
                  </div>
                  {isRegistered && (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Registered
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No upcoming events at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;