const express = require('express');
const router = express.Router();
const LeaderboardController = require('../../modules/leaderboard/leaderboard.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

// Get leaderboard for an event
router.get('/:eventId', LeaderboardController.getLeaderboardByEvent);

// Declare winners (admin only)
router.post('/winners', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['admin']), 
  LeaderboardController.declareWinners
);

module.exports = router;