const express = require('express');
const router = express.Router();
const AuthController = require('../../modules/auth/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware')

// User Authentication
router.post('/register', AuthController.register);
router.post('/verifyOTP', AuthController.verifyOTP); // Add OTP verification route
router.post('/login', AuthController.login);
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

module.exports = router;