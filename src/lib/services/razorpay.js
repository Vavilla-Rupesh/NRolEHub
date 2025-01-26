// Razorpay service to handle payment-related operations
export const initializeRazorpay = (options) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (orderData) => {
  const options = {
    key: 'rzp_test_xsO2YXEJiNnEMm', // Your test key
    amount: orderData.amount,
    currency: 'INR',
    name: 'Campus Connect',
    description: `Registration for ${orderData.event_name}`,
    order_id: orderData.razorpay_order_id,
    prefill: {
      name: orderData.student_name,
      email: orderData.student_email
    },
    theme: {
      color: '#4F46E5'
    }
  };
  return options;
};