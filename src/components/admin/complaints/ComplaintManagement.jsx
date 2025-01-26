import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Search } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../shared/LoadingSpinner';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints/all');
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (complaintId) => {
    if (!response.trim()) {
      toast.error('Please provide a response');
      return;
    }

    try {
      await api.put(`/complaints/${complaintId}/resolve`, { response });
      toast.success('Complaint resolved successfully');
      setSelectedComplaint(null);
      setResponse('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to resolve complaint');
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.complaint_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.student?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.student?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Complaint Management</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search complaints..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="glass-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{complaint.student?.username}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complaint.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{complaint.student?.email}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(complaint.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                  <p>{complaint.complaint_text}</p>
                </div>
              </div>

              {complaint.status === 'resolved' ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-400">Response:</p>
                      <p className="mt-1">{complaint.admin_response}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    placeholder="Type your response..."
                    className="input w-full h-24"
                    value={selectedComplaint === complaint.id ? response : ''}
                    onChange={(e) => {
                      setSelectedComplaint(complaint.id);
                      setResponse(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => handleResolve(complaint.id)}
                    className="btn btn-primary w-full"
                  >
                    Resolve Complaint
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}