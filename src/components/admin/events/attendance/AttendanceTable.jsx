import React, { useState } from 'react';
import { Check, X, Search } from 'lucide-react';

function AttendanceTable({ registrations, onAttendanceUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="mb-4 flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.student_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      registration.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {registration.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.attendance ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!registration.attendance && (
                    <button
                      onClick={() => onAttendanceUpdate(registration.id)}
                      className="btn btn-primary text-sm"
                      disabled={registration.payment_status !== 'paid'}
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

export default AttendanceTable;