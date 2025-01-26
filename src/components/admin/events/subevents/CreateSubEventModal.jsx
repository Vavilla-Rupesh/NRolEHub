import React, { useState } from 'react';
import Modal from '../../../shared/Modal';
import { useAuth } from '../../../../contexts/AuthContext';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { IndianRupee, Upload, X, File } from 'lucide-react';
import { cn } from '../../../../lib/utils';

function CreateSubEventModal({ isOpen, onClose, eventId, onSubEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fee: 0,
    event_id: eventId
  });
  const [resources, setResources] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValid = file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValid) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
      }
      return isValid;
    });

    setResources(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append each resource file
      resources.forEach((file, index) => {
        formDataToSend.append(`resources`, file);
      });

      await api.post('/subevents', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Sub-event created successfully');
      onSubEventCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create sub-event');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Sub-Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <input
            type="text"
            className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter sub-event title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter sub-event description"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Registration Fee (₹)
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.fee}
              onChange={(e) => setFormData(prev => ({ ...prev, fee: parseFloat(e.target.value) }))}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Resources (Optional)
          </label>
          <div className="mt-2 space-y-4">
            {/* File Upload Area */}
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, Images up to 10MB each
                </p>
              </div>
            </div>

            {/* File List */}
            {resources.length > 0 && (
              <div className="space-y-2">
                {resources.map((file, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "bg-gray-50 dark:bg-gray-800/50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Creating...' : 'Create Sub-Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateSubEventModal;