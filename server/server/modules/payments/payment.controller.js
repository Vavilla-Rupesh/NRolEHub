const PaymentService = require('./payment.service');
const { validatePaymentCreation, validatePaymentVerification } = require('./payment.validator');

exports.createPayment = async (req, res) => {
  try {
    validatePaymentCreation(req.body);
    const payment = await PaymentService.createPayment(req.body);   
    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create payment'
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    validatePaymentVerification(req.body);
    const result = await PaymentService.verifyPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};