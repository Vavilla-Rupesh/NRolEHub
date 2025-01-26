import { useState } from 'react';
import api from '../api';
import { initializeRazorpay } from '../services/razorpay';
import toast from 'react-hot-toast';

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const processPayment = async (paymentData) => {
    try {
      setLoading(true);

      // Load Razorpay SDK
      const isLoaded = await initializeRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create payment order
      const orderResponse = await api.post('/payments/create', paymentData);
      const { payment, registration_id } = orderResponse.data;

      // Initialize Razorpay options
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Campus Connect',
        description: `Registration for ${paymentData.event_name}`,
        order_id: payment.id,
        prefill: {
          name: paymentData.student_name,
          email: paymentData.student_email
        },
        handler: async (response) => {
          try {
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            };

            const result = await api.post('/payments/verify', verificationData);
            
            if (result.data.success) {
              toast.success('Payment successful!');
              return { success: true, registration_id };
            }
          } catch (error) {
            toast.error('Payment verification failed');
            return { success: false };
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      return { success: true, registration_id };
    } catch (error) {
      toast.error('Payment initialization failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading };
};