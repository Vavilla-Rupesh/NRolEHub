const express = require('express');
const router = express.Router();
const EventsController = require('../../modules/events/events.controller');

// Event Management
router.get('/', EventsController.getAllEvents);
router.get('/:id', EventsController.getEventById);


module.exports = router;
