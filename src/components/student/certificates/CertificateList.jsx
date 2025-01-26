import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import api from '../../../lib/api';
import { formatDate } from '../../../lib/utils';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../shared/LoadingSpinner';

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data);
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (eventId, subEventId, certificateId) => {
    if (downloading) return;

    try {
      setDownloading(true);
      const response = await api.get(
        `/certificates/download/${eventId}/${subEventId}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${certificateId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!certificates.length) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
        <p className="text-gray-500">
          Certificates will appear here once you complete events
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Certificates</h2>
      
      <div className="grid gap-6">
        {certificates.map(certificate => (
          <div key={certificate.id} className="glass-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{certificate.Event?.event_name}</h3>
                <p className="text-gray-600 mt-1">
                  Issued on {formatDate(certificate.issued_at)}
                </p>
                {certificate.rank && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    {certificate.rank}{certificate.rank === 1 ? 'st' : certificate.rank === 2 ? 'nd' : 'rd'} Place
                  </span>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Certificate ID: {certificate.certificate_id}
                </p>
              </div>
              <button
                onClick={() => handleDownload(
                  certificate.event_id,
                  certificate.subevent_id,
                  certificate.certificate_id
                )}
                disabled={downloading}
                className="btn btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}