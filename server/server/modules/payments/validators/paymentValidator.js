const validatePaymentData = (paymentData) => {
  const requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
  const missingFields = requiredFields.filter(field => !paymentData[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
};