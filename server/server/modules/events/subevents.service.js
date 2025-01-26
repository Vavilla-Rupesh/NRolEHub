const Subevent = require('./subevents.model');
const Event = require('./events.model');
const EventSubeventMapping = require('./eventSubeventMapping.model');
const StudentRegistration = require('./studentRegistration.model');
const { sequelize } = require('../../config/dataBase');
const path = require('path');
const fs = require('fs').promises;

exports.createSubevent = async (subeventData) => {
  const { event_id, resources, ...subeventDetails } = subeventData;

  const event = await Event.findByPk(event_id);
  if (!event) throw new Error('Event not found');

  const subevent = await Subevent.create({
    ...subeventDetails,
    resources: resources || []
  });

  await EventSubeventMapping.create({
    event_id,
    subevent_id: subevent.id,
  });

  return subevent;
};

exports.getSubeventById = async (id) => {
  const subevent = await Subevent.findByPk(id);
  if (!subevent) throw new Error('Subevent not found');
  return subevent;
};

exports.getSubeventsByEvent = async (eventId) => {
  const event = await Event.findByPk(eventId, {
    include: {
      model: Subevent,
      as: 'subevents',
      attributes: ['id', 'title', 'description', 'fee', 'certificate_Generated', 'resources'],
    },
  });

  if (!event) throw new Error('Event not found');

  // Get participants count for each subevent
  const subeventsWithCount = await Promise.all(
    event.subevents.map(async (subevent) => {
      const participants_count = await StudentRegistration.count({
        where: {
          event_id: eventId,
          subevent_id: subevent.id,
          payment_status: 'paid'
        }
      });
      return {
        ...subevent.toJSON(),
        participants_count,
        has_resources: subevent.resources && subevent.resources.length > 0
      };
    })
  );

  return { ...event.toJSON(), subevents: subeventsWithCount };
};