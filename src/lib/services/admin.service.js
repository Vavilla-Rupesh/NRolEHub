import api from '../api';

export const AdminService = {
  async createEvent(eventData) {
    try {
      // Check if eventData is FormData
      if (!(eventData instanceof FormData)) {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
          if (eventData[key] !== undefined && eventData[key] !== null) {
            formData.append(key, eventData[key]);
          }
        });
        eventData = formData;
      }

      const response = await api.post('/admin/events', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async updateEvent(eventId, eventData) {
    try {
      const response = await api.put(`/admin/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/admin/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },

  async getEventRegistrations(eventId, subEventId) {
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      if (subEventId) {
        return response.data.filter(reg => reg.subevent_id === subEventId);
      }
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch registrations');
    }
  }
};