const express = require('express');
const router = express.Router();
const ComplaintsController = require('../../modules/complaint/complaints.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

// Student routes
router.post('/', AuthMiddleware.authenticate, ComplaintsController.createComplaint);
router.get('/my-complaints', AuthMiddleware.authenticate, ComplaintsController.getComplaintsByStudent);

// Admin routes
router.get('/all', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  ComplaintsController.getAllComplaints
);

router.put('/:id/resolve', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  ComplaintsController.resolveComplaint
);

module.exports = router;