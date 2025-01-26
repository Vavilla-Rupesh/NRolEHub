const crypto = require('crypto');

const verifyPaymentSignature = (paymentData, secretKey) => {
  const generatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(`${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === paymentData.razorpay_signature;
};