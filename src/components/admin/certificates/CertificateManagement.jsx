import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import api from '../../../lib/api';
import LoadingSpinner from '../../shared/LoadingSpinner';
import toast from 'react-hot-toast';

function CertificateManagement() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Certificate Management</h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upload Certificate Template</h2>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Click to upload template</span>
            <input type="file" className="hidden" accept=".pdf" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default CertificateManagement;