const Event = require('./events.model');
const StudentRegistration = require('./studentRegistration.model');
const { sequelize } = require('../../config/dataBase');

exports.getAllEvents = async (page, limit, userId = null, role = null) => {
  const offset = (page - 1) * limit;
  
  // If user is admin, only show their created events
  // If user is student or no user (public), show all events
  const whereClause = role === 'admin' ? { created_by: userId } : {};
  
  return Event.findAndCountAll({ 
    where: whereClause,
    offset, 
    limit,
    order: [['created_at', 'DESC']]
  });
};

exports.getEventById = async (eventId, userId = null, role = null) => {
  const whereClause = {
    id: eventId
  };
  
  // If user is admin, verify they created this event
  if (role === 'admin') {
    whereClause.created_by = userId;
  }
  
  const event = await Event.findOne({ where: whereClause });
  if (!event) {
    if (role === 'admin') {
      throw new Error('Event not found or you do not have permission to view it');
    }
    throw new Error('Event not found');
  }
  
  return event;
};

exports.getParticipantsCount = async (eventId, subEventId = null) => {
  const where = {
    event_id: eventId,
    payment_status: 'paid'
  };
  
  if (subEventId) {
    where.subevent_id = subEventId;
  }
  
  return StudentRegistration.count({ where });
};