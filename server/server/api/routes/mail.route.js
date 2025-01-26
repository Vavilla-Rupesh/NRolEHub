const express = require('express');
const router = express.Router();
const MailController = require('../../modules/mail/mail.controller');

// Send Certificate Email
router.post('/certificate', MailController.sendCertificate);

// Send OTP Email
router.post('/otp', MailController.sendPasswordResetOTP);

module.exports = router;
