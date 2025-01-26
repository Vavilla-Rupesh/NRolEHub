import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Download, Users } from 'lucide-react';
import api from '../../../lib/api';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

const NATURE_OF_ACTIVITIES = [
  'CEA/NSS/National Initiatives (OLD)',
  'Sports & Games',
  'Cultural Activities',
  'Women\'s forum activities',
  'Hobby clubs Activities',
  'Professional society Activities',
  'Dept. Students Association Activities',
  'Technical Club Activities',
  'Innovation and Incubation Cell Activities',
  'Professional Self Initiatives',
  'Others'
];

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [subevents, setSubevents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    year: '',
    semester: '',
    college: '',
    branch: '',
    event: '',
    subevent: '',
    natureOfActivity: '',
    attendance: '',
    certificateStatus: '',
    participationType: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.rows || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchSubevents = async (eventId) => {
    if (!eventId) {
      setSubevents([]);
      return;
    }
    try {
      const response = await api.get(`/subevents/${eventId}`);
      setSubevents(response.data.subevents || []);
    } catch (error) {
      console.error('Failed to fetch subevents:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filterData = (data) => {
    return data.filter(student => {
      if (!student.razorpay_payment_id || student.razorpay_payment_id.trim() === '') {
        return false;
      }
      const searchFields = [
        student.name,
        student.email,
        student.mobile_number,
        student.college_name,
        student.stream,
        student.event_name,
        student.subevent_name,
        student.razorpay_payment_id,
        student.certificate_id
      ].map(field => field?.toLowerCase());

      const matchesSearch = searchFields.some(field => 
        field?.includes(searchTerm.toLowerCase())
      );

      const matchesFilters = (
        (!filters.name || student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.year || student.year.toString() === filters.year) &&
        (!filters.semester || student.semester.toString() === filters.semester) &&
        (!filters.college || student.college_name?.toLowerCase().includes(filters.college.toLowerCase())) &&
        (!filters.branch || student.stream?.toLowerCase().includes(filters.branch.toLowerCase())) &&
        (!filters.event || student.event_name === filters.event) &&
        (!filters.subevent || student.subevent_name === filters.subevent) &&
        (!filters.natureOfActivity || student.nature_of_activity === filters.natureOfActivity) &&
        (!filters.attendance || student.attendance.toString() === filters.attendance) &&
        (!filters.certificateStatus || (filters.certificateStatus === 'yes' ? student.certificate_id : !student.certificate_id)) &&
        (!filters.participationType || student.participation_type === filters.participationType)
      );

      return matchesSearch && matchesFilters;
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Mobile', 'Year', 'Semester', 'College', 'Branch',
      'Event', 'Sub Event', 'Nature of Activity', 'Payment ID', 'Certificate ID',
      'Attendance', 'Participation Type'
    ];

    const csvData = filteredStudents.map(student => [
      student.name,
      student.email,
      student.mobile_number,
      student.year,
      student.semester,
      student.college_name,
      student.stream,
      student.event_name,
      student.subevent_name,
      student.nature_of_activity,
      student.razorpay_payment_id,
      student.certificate_id || 'N/A',
      student.attendance ? 'Present' : 'Absent',
      student.participation_type
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student_data.csv';
    link.click();
  };

  const filteredStudents = filterData(sortData(students));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Student Management
        </h1>
        <button
          onClick={exportToCSV}
          className="btn btn-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </button>
      </div>

      <div className="glass-card space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => document.getElementById('filterDrawer').showModal()}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'mobile_number', label: 'Mobile' },
                  { key: 'year', label: 'Year' },
                  { key: 'semester', label: 'Semester' },
                  { key: 'college_name', label: 'College' },
                  { key: 'stream', label: 'Branch' },
                  { key: 'event_name', label: 'Event' },
                  { key: 'subevent_name', label: 'Sub Event' },
                  { key: 'nature_of_activity', label: 'Nature of Activity' },
                  { key: 'razorpay_payment_id', label: 'Payment ID' },
                  { key: 'certificate_id', label: 'Certificate ID' },
                  { key: 'attendance', label: 'Attendance' },
                  { key: 'participation_type', label: 'Participation' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      <ArrowUpDown className={cn(
                        "h-4 w-4",
                        sortConfig.key === key ? "text-primary" : "text-gray-400"
                      )} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.mobile_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.college_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.stream}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.event_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.subevent_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.nature_of_activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.razorpay_payment_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.certificate_id || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      student.attendance
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {student.attendance ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      student.participation_type === 'Merit'
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    )}>
                      {student.participation_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Filter Dialog */}
      <dialog id="filterDrawer" className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg mb-4">Filter Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                type="text"
                className="input w-full"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                placeholder="Filter by name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Event</label>
              <select
                className="input w-full"
                value={filters.event}
                onChange={(e) => {
                  setFilters({ ...filters, event: e.target.value, subevent: '' });
                  fetchSubevents(e.target.value);
                }}
              >
                <option value="">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.event_name}>
                    {event.event_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sub Event</label>
              <select
                className="input w-full"
                value={filters.subevent}
                onChange={(e) => setFilters({ ...filters, subevent: e.target.value })}
                disabled={!filters.event}
              >
                <option value="">All Sub Events</option>
                {subevents.map(subevent => (
                  <option key={subevent.id} value={subevent.title}>
                    {subevent.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                className="input w-full"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <option value="">All</option>
                {[1, 2, 3, 4].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                className="input w-full"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              >
                <option value="">All</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">College</label>
              <input
                type="text"
                className="input w-full"
                value={filters.college}
                onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                placeholder="Filter by college name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <input
                type="text"
                className="input w-full"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                placeholder="Filter by branch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nature of Activity</label>
              <select
                className="input w-full"
                value={filters.natureOfActivity}
                onChange={(e) => setFilters({ ...filters, natureOfActivity: e.target.value })}
              >
                <option value="">All</option>
                {NATURE_OF_ACTIVITIES.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Attendance</label>
              <select
                className="input w-full"
                value={filters.attendance}
                onChange={(e) => setFilters({ ...filters, attendance: e.target.value })}
              >
                <option value="">All</option>
                <option value="true">Present</option>
                <option value="false">Absent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Certificate Status</label>
              <select
                className="input w-full"
                value={filters.certificateStatus}
                onChange={(e) => setFilters({ ...filters, certificateStatus: e.target.value })}
              >
                <option value="">All</option>
                <option value="yes">Has Certificate</option>
                <option value="no">No Certificate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Participation Type</label>
              <select
                className="input w-full"
                value={filters.participationType}
                onChange={(e) => setFilters({ ...filters, participationType: e.target.value })}
              >
                <option value="">All</option>
                <option value="Merit">Merit</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <button
              onClick={() => {
                setFilters({
                  name: '',
                  year: '',
                  semester: '',
                  college: '',
                  branch: '',
                  event: '',
                  subevent: '',
                  natureOfActivity: '',
                  attendance: '',
                  certificateStatus: '',
                  participationType: ''
                });
              }}
              className="btn btn-ghost"
            >
              Reset Filters
            </button>
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}