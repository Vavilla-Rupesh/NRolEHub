import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

export function useCertificateDownload() {
  const [downloading, setDownloading] = useState(false);

  const downloadCertificate = async (eventId, subEventId) => {
    if (downloading) return;

    try {
      setDownloading(true);


      // Get certificate details
      const response = await api.get(`/certificates/${eventId}`, {
        params: { subevent_id: subEventId },
        responseType: 'blob', // Important for file download
      });

      // Convert the image (png/jpg) to a PDF
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      const img = new Image();

      img.onload = async () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height],
        });

        pdf.addImage(img, 'JPG', 0, 0, img.width, img.height);
        pdf.save(`${subEventId}_certificate_.pdf`);

        URL.revokeObjectURL(imageUrl); // Clean up the object URL
        toast.success(`Certificate for ${subevent_id} downloaded successfully as PDF`);
      };

      img.onerror = () => {
        toast.error('Failed to generate the PDF');
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Certificate download error:', error);
      toast.error('Certificate not available yet');
    } finally {
      setDownloading(false);
    }
  };

  return { downloadCertificate, downloading };
}
