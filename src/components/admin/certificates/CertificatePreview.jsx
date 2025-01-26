import React, { useState, useRef, useEffect } from 'react';
import { Eye, Download, Cursor, RotateCcw, Upload } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function CertificatePreview() {
  const [template, setTemplate] = useState(null);
  const [templatePreview, setTemplatePreview] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const imageRef = useRef(null);
  const [fieldPositions, setFieldPositions] = useState({
    name: { x: 300, y: 400 },
    date: { x: 300, y: 500 },
    event: { x: 300, y: 300 },
    certificateId: { x: 850, y: 550 }
  });

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setTemplate(file);
      const reader = new FileReader();
      reader.onload = (e) => setTemplatePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    if (!previewMode && templatePreview && selectedField) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setFieldPositions(prev => ({
        ...prev,
        [selectedField]: { x, y }
      }));
    }
  };

  const generateCertificateId = () => {
    const prefix = 'CC';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <label className="btn btn-primary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleTemplateUpload}
            />
          </label>
          <span className="text-sm text-gray-600">
            {template ? template.name : 'No template uploaded'}
          </span>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="btn btn-secondary"
            disabled={!templatePreview}
          >
            {previewMode ? (
              <>
                <Cursor className="h-4 w-4 mr-2" />
                Edit Positions
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={() => setFieldPositions({
              name: { x: 300, y: 400 },
              date: { x: 300, y: 500 },
              event: { x: 300, y: 300 },
              certificateId: { x: 850, y: 550 }
            })}
            className="btn btn-ghost"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Positions
          </button>
        </div>
      </div>

      {templatePreview ? (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={templatePreview}
            alt="Certificate Template"
            className="w-full h-auto cursor-crosshair"
            onClick={handleImageClick}
          />

          {!previewMode && (
            <div className="absolute top-4 left-4 space-y-2 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">
              <p className="font-medium mb-2">Select field to position:</p>
              {Object.keys(fieldPositions).map(field => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={cn(
                    "btn btn-sm w-full",
                    selectedField === field ? 'btn-primary' : 'btn-ghost'
                  )}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Field Position Markers */}
          {!previewMode && Object.entries(fieldPositions).map(([field, pos]) => (
            <div
              key={field}
              className="absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.x, top: pos.y }}
            >
              <span className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-primary text-white px-2 py-1 rounded">
                {field}
              </span>
            </div>
          ))}

          {/* Preview Mode */}
          {previewMode && (
            <>
              <div
                className="absolute text-2xl font-bold text-gray-800"
                style={{ left: fieldPositions.name.x, top: fieldPositions.name.y }}
              >
                John Doe
              </div>
              <div
                className="absolute text-lg text-gray-700"
                style={{ left: fieldPositions.date.x, top: fieldPositions.date.y }}
              >
                March 15, 2024
              </div>
              <div
                className="absolute text-xl font-semibold text-gray-800"
                style={{ left: fieldPositions.event.x, top: fieldPositions.event.y }}
              >
                Web Development Workshop
              </div>
              <div
                className="absolute text-sm text-gray-600"
                style={{ left: fieldPositions.certificateId.x, top: fieldPositions.certificateId.y }}
              >
                {generateCertificateId()}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Upload a certificate template to begin</p>
        </div>
      )}

      {templatePreview && !previewMode && (
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Field Positions</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(fieldPositions).map(([field, pos]) => (
              <div key={field} className="space-y-2">
                <p className="font-medium">{field}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-500">X</label>
                    <input
                      type="number"
                      value={pos.x}
                      onChange={(e) => setFieldPositions(prev => ({
                        ...prev,
                        [field]: { ...pos, x: parseInt(e.target.value) }
                      }))}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Y</label>
                    <input
                      type="number"
                      value={pos.y}
                      onChange={(e) => setFieldPositions(prev => ({
                        ...prev,
                        [field]: { ...pos, y: parseInt(e.target.value) }
                      }))}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}