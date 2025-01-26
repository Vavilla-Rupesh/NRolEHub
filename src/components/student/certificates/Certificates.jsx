import React, { useState, useEffect } from 'react';
import { Download, Scroll } from 'lucide-react';
import api from '../../../lib/api';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { formatDate } from '../../../lib/utils';
import toast from 'react-hot-toast';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Certificates</h1>
      
      <div className="grid gap-6">
        {certificates.map(certificate => (
          <div key={certificate.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">
                  {certificate.event_name}
                </h3>
                <p className="text-gray-600 mt-1">
                  Issued on {formatDate(certificate.issued_at)}
                </p>
              </div>
              <a
                href={certificate.certificate_url}
                download
                className="btn btn-primary flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;