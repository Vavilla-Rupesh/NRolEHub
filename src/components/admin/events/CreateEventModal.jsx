import React from 'react';
import Modal from '../../shared/Modal';
import EventForm from './EventForm';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminService } from '../../../lib/services/admin.service';
import toast from 'react-hot-toast';

function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { user } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      // Ensure formData is properly set up
      if (!(formData instanceof FormData)) {
        throw new Error('Form data must be FormData instance');
      }

      // Add created_by if not present
      if (!formData.get('created_by')) {
        formData.append('created_by', user?.id);
      }

      await AdminService.createEvent(formData);
      toast.success('Event created successfully');
      onEventCreated?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <EventForm 
        onSubmit={handleSubmit}
        submitText="Create Event"
        initialData={{ created_by: user?.id }}
      />
    </Modal>
  );
}

export default CreateEventModal;