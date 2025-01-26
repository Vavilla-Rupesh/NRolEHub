const express = require('express');
const router = express.Router();
const SubeventController = require('../../modules/events/subevents.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const upload = require('../../utils/multer');

// Create a subevent (mapping happens automatically)
router.post('/', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  upload.array('resources', 10), // Allow up to 10 files
  SubeventController.createSubevent
);

// Get all subevents for a specific event
router.get('/:eventId', SubeventController.getSubeventsByEvent);

// Download resources for a subevent
router.get('/:id/resources', SubeventController.downloadResources);

module.exports = router;