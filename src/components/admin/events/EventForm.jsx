import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { validateEventForm } from '../../../lib/validation';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

function EventForm({ initialData = {}, onSubmit, submitText = 'Submit' }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    eligibility_criteria: '',
    nature_of_activity: '',
    iqac_reference: '',
    created_by: user?.id,
    ...initialData
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.event_image || '');
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateEventForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUploading(true);

      // Create FormData object
      const formDataToSubmit = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      // Append image file if exists
      if (imageFile) {
        formDataToSubmit.append('event_image', imageFile);
      }

      await onSubmit(formDataToSubmit);
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    const input = document.getElementById('event_image');
    if (input) {
      input.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Event Name</label>
        <input
          type="text"
          name="event_name"
          className={`input w-full ${errors.event_name ? 'border-red-500' : ''}`}
          value={formData.event_name}
          onChange={handleChange}
          required
        />
        {errors.event_name && (
          <p className="text-red-500 text-sm mt-1">{errors.event_name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          className="input w-full"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="datetime-local"
            name="start_date"
            className={`input w-full ${errors.start_date ? 'border-red-500' : ''}`}
            value={formData.start_date}
            onChange={handleChange}
            required
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="datetime-local"
            name="end_date"
            className={`input w-full ${errors.end_date ? 'border-red-500' : ''}`}
            value={formData.end_date}
            onChange={handleChange}
            required
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Venue</label>
        <input
          type="text"
          name="venue"
          className={`input w-full ${errors.venue ? 'border-red-500' : ''}`}
          value={formData.venue}
          onChange={handleChange}
          required
        />
        {errors.venue && (
          <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nature of Activity</label>
        <select
          name="nature_of_activity"
          className="input w-full"
          value={formData.nature_of_activity}
          onChange={handleChange}
          required
        >
          <option value="">Select activity type</option>
          {NATURE_OF_ACTIVITY_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">IQAC Reference Number</label>
        <input
          type="text"
          name="iqac_reference"
          className="input w-full"
          value={formData.iqac_reference}
          onChange={handleChange}
          required
          placeholder="Enter unique IQAC reference number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Event Image/Flyer (Optional)</label>
        <div className="mt-2">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Event preview"
                className="max-h-48 rounded-lg mx-auto"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <ImageIcon className="h-12 w-12" />
                </div>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                    <span>Upload a file</span>
                    <input
                      id="event_image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
        <textarea
          name="eligibility_criteria"
          className="input w-full"
          rows="2"
          value={formData.eligibility_criteria}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="btn btn-primary w-full"
      >
        {uploading ? 'Creating Event...' : submitText}
      </button>
    </form>
  );
}

export default EventForm;

const NATURE_OF_ACTIVITY_OPTIONS = [
  'CEA/NSS/National Initiatives (OLD)',
  'Sports & Games',
  'Cultural Activities',
  'Women\'s forum activities',
  'Hobby clubs Activities',
  'Professional society Activities',
  'Dept. Students Association Activities',
  'Technical Club Activities',
  'Innovation and Incubation Cell Activities',
  'Professional Self Initiatives',
  'Others'
];