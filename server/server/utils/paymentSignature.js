const crypto = require('crypto');

/**
 * Verifies Razorpay payment signature
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Razorpay order ID
 * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
 * @param {string} paymentData.razorpay_signature - Razorpay signature
 * @param {string} secretKey - Razorpay secret key
 * @returns {boolean} - Whether signature is valid
 */
const verifyPaymentSignature = (paymentData, secretKey) => {
  try {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(`${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === paymentData.razorpay_signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

module.exports = verifyPaymentSignature;