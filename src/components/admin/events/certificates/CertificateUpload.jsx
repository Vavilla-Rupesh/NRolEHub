import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

function CertificateUpload({ eventId, registrations }) {
  const [uploading, setUploading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    namePositionX: '300',
    namePositionY: '400',
    eventPositionX: '300',
    eventPositionY: '300',
    datePositionX: '300',
    datePositionY: '200',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.pdfFileInput.files[0]) {
      toast.error('Please select a certificate template');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFileInput', e.target.pdfFileInput.files[0]);
    formData.append('event_id', eventId);
    Object.entries(coordinates).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setUploading(true);
    try {
      await api.post('/certificates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Certificates generated and sent successfully');
    } catch (error) {
      toast.error('Failed to generate certificates');
    } finally {
      setUploading(false);
    }
  };

  const eligibleCount = registrations.filter(
    (r) => r.payment_status === 'paid' && r.attendance
  ).length;

  return (
    <div className="space-y-6">
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Certificate Information</h3>
            <p className="text-sm text-blue-700 mt-1">
              {eligibleCount} students are eligible for certificates (paid and
              attended)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Certificate Template (PDF)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                Click to upload template
              </span>
              <input
                type="file"
                name="pdfFileInput"
                accept=".pdf"
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name Position X
            </label>
            <input
              type="number"
              className="input"
              value={coordinates.namePositionX}
              onChange={(e) =>
                setCoordinates({
                  ...coordinates,
                  namePositionX: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Name Position Y
            </label>
            <input
              type="number"
              className="input"
              value={coordinates.namePositionY}
              onChange={(e) =>
                setCoordinates({
                  ...coordinates,
                  namePositionY: e.target.value,
                })
              }
            />
          </div>
          {/* Similar inputs for event and date positions */}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={uploading}
        >
          {uploading ? 'Generating Certificates...' : 'Generate Certificates'}
        </button>
      </form>
    </div>
  );
}

export default CertificateUpload;