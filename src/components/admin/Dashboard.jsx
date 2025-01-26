import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from './Home';
import EventManagement from './events/EventManagement';
import EventDetails from './events/EventDetails';
import CertificateManagement from './certificates/CertificateManagement';
import LeaderboardManagement from './leaderboard/LeaderboardManagement';
import AttendanceManager from './events/attendance/AttendanceManager';
import LeaderboardManager from './events/leaderboard/LeaderboardManager';
import CertificatesManager from './events/certificates/CertificateManager';
import StudentManagement from './students/StudentManagement';
import AdminProfile from './profile/AdminProfile';

function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/events" element={<EventManagement />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/certificates" element={<CertificateManagement />} />
        <Route path="/leaderboard" element={<LeaderboardManagement />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/profile" element={<AdminProfile />} />
        
        {/* Subevent management routes */}
        <Route 
          path="/events/:eventId/subevents/:subEventId/attendance" 
          element={<AttendanceManager />} 
        />
        <Route 
          path="/events/:eventId/subevents/:subEventId/leaderboard" 
          element={<LeaderboardManager />} 
        />
        <Route 
          path="/events/:eventId/subevents/:subEventId/certificates" 
          element={<CertificatesManager />} 
        />
      </Routes>
    </div>
  );
}

export default AdminDashboard;