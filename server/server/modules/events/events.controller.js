const EventsService = require('./events.service');

exports.getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?.id;
    const role = req.user?.role;
    
    const events = await EventsService.getAllEvents(page, limit, userId, role);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    
    const event = await EventsService.getEventById(req.params.id, userId, role);
    res.status(200).json(event);
  } catch (error) {
    if (error.message.includes('permission')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(404).json({ message: error.message });
    }
  }
};