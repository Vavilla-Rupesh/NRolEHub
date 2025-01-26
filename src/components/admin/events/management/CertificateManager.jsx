import React, { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { useCertificates } from '../../../../lib/hooks/useCertificates';
import LoadingSpinner from '../../../shared/LoadingSpinner';

export default function CertificateManager({ eventId, subEventId }) {
  const { generateCertificates, loading, eligibleCount } = useCertificates(eventId, subEventId);
  const [template, setTemplate] = useState(null);
  const [coordinates, setCoordinates] = useState({
    namePositionX: '300',
    namePositionY: '400',
    eventPositionX: '300',
    eventPositionY: '300',
    datePositionX: '300',
    datePositionY: '200'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!template) return;

    const formData = new FormData();
    formData.append('pdfFileInput', template);
    formData.append('event_id', eventId);
    formData.append('subevent_id', subEventId);
    
    Object.entries(coordinates).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await generateCertificates(formData);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Check className="h-5 w-5 text-blue-500" />
          <p className="text-blue-700 dark:text-blue-300">
            {eligibleCount} students are eligible for certificates
            (paid and attended)
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Certificate Template (PDF)
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf"
                    onChange={(e) => setTemplate(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(coordinates).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                className="input mt-1"
                value={value}
                onChange={(e) => setCoordinates({
                  ...coordinates,
                  [key]: e.target.value
                })}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!template || loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Generating...' : 'Generate Certificates'}
        </button>
      </form>
    </div>
  );
}