import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useAttendance } from '../../../../lib/hooks/useAttendance';
import LoadingSpinner from '../../../shared/LoadingSpinner';

export default function AttendanceManager({ eventId, subEventId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { registrations, loading, markAttendance } = useAttendance(eventId, subEventId);

  const filteredRegistrations = registrations?.filter(reg => 
    reg.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
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
                  {!registration.attendance && registration.payment_status === 'paid' && (
                    <button
                      onClick={() => markAttendance(registration.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Mark Present
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}