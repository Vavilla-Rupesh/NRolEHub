import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import PaidEventsList from './paid/PaidEventsList';

function MyEvents() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredSubevents = location.state?.filteredSubevents || [];

  // If we have filtered subevents from navigation, use them as initial search term
  useEffect(() => {
    if (filteredSubevents.length > 0) {
      setSearchTerm(filteredSubevents[0]);
    }
  }, [filteredSubevents]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Events</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by subevent name..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <PaidEventsList searchTerm={searchTerm} />
    </div>
  );
}

export default MyEvents;