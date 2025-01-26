import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

function SupportPage() {
  const [complaint, setComplaint] = useState({
    event_id: '',
    complaint_text: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', complaint);
      toast.success('Complaint submitted successfully');
      setComplaint({ event_id: '', complaint_text: '' });
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support & Help</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Submit a Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event ID</label>
              <input
                type="text"
                className="input"
                value={complaint.event_id}
                onChange={(e) => setComplaint(prev => ({ ...prev, event_id: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Complaint</label>
              <textarea
                className="input"
                rows="4"
                value={complaint.complaint_text}
                onChange={(e) => setComplaint(prev => ({ ...prev, complaint_text: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>support@campusconnect.com</span>
            </div>
            <p className="text-gray-600">
              Our support team is available Monday through Friday, 9:00 AM to 5:00 PM.
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;