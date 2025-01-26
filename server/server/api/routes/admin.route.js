const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/auth.middleware');
const AdminController = require('../../modules/admin/admin.controller');
const upload = require('../../utils/multer');

// Admin Actions
router.post(
  '/events', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(["admin"]),
  upload.single('event_image'),
  AdminController.createEvent
);

router.get(
  '/events/:id/registrations', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(["admin"]), 
  AdminController.getEventRegistrations
);

router.get(
  '/events/:id/export-registrations',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  AdminController.exportRegistrations
);

router.put(
  '/mark-attendance/:registrationId', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  AdminController.markAttendance
);

router.put(
  '/events/:eventId/subevents/:subEventId/bulk-attendance', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  AdminController.markBulkAttendance
);

// Add new route for getting all student registrations
router.get(
  '/students',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  AdminController.getAllStudentRegistrations
);

module.exports = router;