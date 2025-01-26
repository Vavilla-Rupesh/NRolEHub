import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Check, X, Users } from 'lucide-react';
import { useAttendance } from '../../../../lib/hooks/useAttendance';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import EmptyState from '../../../shared/EmptyState';
import toast from 'react-hot-toast';

export default function AttendanceManager() {
  const { eventId, subEventId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    registrations, 
    loading, 
    bulkUpdating,
    toggleAttendance, 
    markBulkAttendance,
    refreshRegistrations 
  } = useAttendance(parseInt(eventId), parseInt(subEventId));

  if (loading) return <LoadingSpinner />;

  if (!registrations?.length) {
    return (
      <EmptyState
        icon={Users}
        title="No Registrations Found"
        message="There are no registrations for this event yet."
      />
    );
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalParticipants = registrations.length;
  const presentCount = registrations.filter(reg => reg.attendance).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="stats glass-card p-4 flex items-center space-x-4">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
            <p className="text-2xl font-bold">{totalParticipants}</p>
          </div>
          <div className="border-l pl-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => markBulkAttendance(true)}
            disabled={bulkUpdating}
            className="btn btn-success btn-sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Present
          </button>
          <button
            onClick={() => markBulkAttendance(false)}
            disabled={bulkUpdating}
            className="btn btn-destructive btn-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Mark All Absent
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.student_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.attendance ? (
                    <span className="inline-flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-1" /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <X className="h-5 w-5 mr-1" /> Absent
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAttendance(registration.id, registration.attendance)}
                    className={`btn btn-sm ${registration.attendance ? 'btn-destructive' : 'btn-success'}`}
                  >
                    {registration.attendance ? 'Mark Absent' : 'Mark Present'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}