import React from 'react';
import { Users, Award, FileCheck } from 'lucide-react';
import AttendanceStatus from './attendance/AttendanceStatus';
import LeaderboardView from './leaderboard/LeaderboardView';
import CertificateStatus from './certificates/CertificateStatus';

export default function EventTabs({ eventId, subEventId, activeTab, onTabChange }) {
  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Users, component: AttendanceStatus },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award, component: LeaderboardView },
    { id: 'certificates', label: 'Certificates', icon: FileCheck, component: CertificateStatus }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {ActiveComponent && (
          <ActiveComponent eventId={eventId} subEventId={subEventId} />
        )}
      </div>
    </div>
  );
}