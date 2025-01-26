const express = require('express');
const router = express.Router();
const StudentRegistrationsController = require('../../modules/events/studentRegistration.controller');
const AuthMiddleware = require('../middleware/auth.middleware')

// Student Registration
// Need to be logged in before accessing these routes
router.post('/register', AuthMiddleware.authenticate, StudentRegistrationsController.registerForEvent);
router.get('/my-registrations', AuthMiddleware.authenticate,StudentRegistrationsController.getRegistrationsByStudent);

module.exports = router;