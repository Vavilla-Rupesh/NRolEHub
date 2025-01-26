const express = require('express');
const router = express.Router();
const NotificationsController = require('../../modules/notifications/notifications.controller');
const AuthMiddleware = require('./../middleware/auth.middleware')

// Notifications Management
router.post('/',AuthMiddleware.authenticate, AuthMiddleware.authorize(['admin']) ,NotificationsController.createNotification);
router.post('/send',AuthMiddleware.authenticate, AuthMiddleware.authorize(['admin']) ,NotificationsController.sendNotification);

module.exports = router;
