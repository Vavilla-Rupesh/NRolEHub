const validatePaymentCreation = (data) => {
  const requiredFields = [
    'student_id',
    'event_id',
    'student_name',
    'student_email',
    'event_name',
    'amount'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
};

const validatePaymentVerification = (data) => {
  const requiredFields = [
    'razorpay_payment_id',
    'razorpay_order_id',
    'razorpay_signature'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
};

module.exports = {
  validatePaymentCreation,
  validatePaymentVerification
};