const express = require('express');
const router = express.Router();
const PaymentDetailsController = require('../../modules/payments/payment.controller');
const AuthMiddleware = require('../middleware/auth.middleware')

// router.post('/create', AuthMiddleware.authenticate, PaymentDetailsController.createPayment);
// router.post('/verify', AuthMiddleware.authenticate, PaymentDetailsController.verifyPayment);

router.post('/create',  PaymentDetailsController.createPayment);
router.post('/verify',  PaymentDetailsController.verifyPayment);

module.exports = router;
